"use client";
import { updatePlayer } from "@/actions/database/player";
import FormElement from "@/components/form/form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Players } from "@/lib/prisma/generated";
import { getErrorMessage, getRoles } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EditPlayerSchema, EditPlayerSchemaType } from "./edit-player-schema";

const rolesOptions = [
  { label: "Admin", value: "admin", removable: false },
  { label: "Moderator", value: "moderator" },
];

export default function EditPlayerForm({
  player,
  callback,
}: {
  player: Players;
  callback?: () => void;
}) {
  const form = useForm<EditPlayerSchemaType>({
    resolver: zodResolver(EditPlayerSchema),
    defaultValues: {
      roles: getRoles(player.roles),
    },
  });

  async function onSubmit(values: EditPlayerSchemaType) {
    try {
      const { error } = await updatePlayer(player.id, {
        roles: values.roles,
      });
      if (error) {
        throw new Error(error);
      }
      toast.success("Player successfully updated");
      if (callback) {
        callback();
      }
    } catch (error) {
      toast.error("Failed to update player", {
        description: getErrorMessage(error),
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormElement
          control={form.control}
          name={"roles"}
          options={rolesOptions}
          defaultValues={getRoles(player.roles)}
          label="Roles"
          description="The roles of the player."
          placeholder="Select roles"
          error={form.formState.errors.roles}
          className="w-full min-w-64"
          type="multi-select"
        />

        <Button
          type="submit"
          className="w-full mt-4"
          disabled={form.formState.isSubmitting}
        >
          Save
        </Button>
      </form>
    </Form>
  );
}

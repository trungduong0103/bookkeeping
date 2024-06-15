import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createAuthor } from "@/fetchers";
import type { IAuthor } from "@/interfaces";
import { TextInput } from "@/components/TextInput";
import { Button } from "@/components/Button";
import { useState } from "react";

const authorSchema = object()
  .shape({ fullName: string().required("Full Name is required") })
  .required();

export default function AddAuthorPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(authorSchema),
  });
  const [creating, setCreating] = useState(false);

  const onSubmit = async (data: Pick<IAuthor, "fullName">) => {
    setCreating(true);
    try {
      await createAuthor(data.fullName);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <h1 className="prose-2xl font-bold leading-3 mb-5">Add new author</h1>
      <form className="flex flex-col gap-3 w-[500px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-2 items-center justify-between mb-5">
          <label className="block font-bold">Full Name*</label>
          {creating ? (
            <div className="skeleton w-[250px]" />
          ) : (
            <TextInput
            className="w-[250px]"
              placeholder="Enter Author's name"
              {...register("fullName")}
            />
          )}
        </div>
        {errors.fullName && (
          <p className="prose-sm text-red">{errors.fullName.message}</p>
        )}
        <Button variant="info" disabled={creating} type="submit">
          {creating ? "Creating..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}

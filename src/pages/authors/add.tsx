import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createAuthor } from "@/fetchers";
import type { Author } from "@/interfaces";
import { TextInput } from "@/components/TextInput";

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

  const onSubmit = async (data: Pick<Author, "fullName">) => {
    await createAuthor(data.fullName);
  };

  return (
    <div>
      <h1 className="prose-2xl font-bold leading-3 mb-5">Add new author</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Full Name*</label>
        <br />
        <TextInput {...register("fullName")} />
        {errors.fullName && <p className="prose-sm text-red">{errors.fullName.message}</p>}
      </form>
    </div>
  );
}

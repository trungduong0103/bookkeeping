import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Author } from "@/interfaces";

const authorSchema = object()
  .shape({ fullName: string().required() })
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
    // TODO
    // await updateAuthor(author.id, { fullName: data.fullName });
    // const apiAuthor = await fetchAuthor(author.id);
    // setClientAuthor(apiAuthor);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Full Name</label>
        <br />
        <input {...register("fullName")} />
        {errors.fullName && <div>{errors.fullName.message}</div>}
      </form>
    </div>
  );
}

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createContactMessage } from "../../api/siteApi";
import { getErrorMessage } from "../../lib/axios";
import { SectionTitle } from "../../components/common/SectionTitle";

export const ContactPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const mutation = useMutation({
    mutationFn: createContactMessage,
    onSuccess: () => {
      toast.success("Message sent successfully");
      reset();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to send message")),
  });

  return (
    <section className="section-space">
      <div className="container-pad grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <SectionTitle
            eyebrow="Contact"
            title="Get in Touch"
            description="Send questions, partnership requests, or support issues. Your message will be stored in our backend."
          />

          <form className="card space-y-4 p-6" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
            <div>
              <label htmlFor="contact-name" className="mb-1 block text-sm font-semibold">
                Name
              </label>
              <input
                id="contact-name"
                className="input"
                {...register("name", { required: "Name is required", minLength: { value: 2, message: "Minimum 2 characters" } })}
              />
              {errors.name ? <p className="mt-1 text-xs text-[var(--danger)]">{errors.name.message}</p> : null}
            </div>

            <div>
              <label htmlFor="contact-email" className="mb-1 block text-sm font-semibold">
                Email
              </label>
              <input
                id="contact-email"
                className="input"
                type="email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email ? <p className="mt-1 text-xs text-[var(--danger)]">{errors.email.message}</p> : null}
            </div>

            <div>
              <label htmlFor="contact-subject" className="mb-1 block text-sm font-semibold">
                Subject
              </label>
              <input
                id="contact-subject"
                className="input"
                {...register("subject", { required: "Subject is required", minLength: { value: 3, message: "Minimum 3 characters" } })}
              />
              {errors.subject ? <p className="mt-1 text-xs text-[var(--danger)]">{errors.subject.message}</p> : null}
            </div>

            <div>
              <label htmlFor="contact-message" className="mb-1 block text-sm font-semibold">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={6}
                className="input"
                {...register("message", { required: "Message is required", minLength: { value: 10, message: "Minimum 10 characters" } })}
              />
              {errors.message ? <p className="mt-1 text-xs text-[var(--danger)]">{errors.message.message}</p> : null}
            </div>

            <button className="btn btn-primary" type="submit" disabled={isSubmitting || mutation.isPending}>
              {isSubmitting || mutation.isPending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <aside className="card h-fit space-y-4 p-6">
          <h3 className="text-xl font-bold">Contact Information</h3>
          <p className="text-sm text-[var(--text-soft)]">Email: support@contestforge.dev</p>
          <p className="text-sm text-[var(--text-soft)]">Phone: +880 1700-000000</p>
          <p className="text-sm text-[var(--text-soft)]">Office: Dhaka, Bangladesh</p>
        </aside>
      </div>
    </section>
  );
};

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createContestPaymentIntent } from "../../api/paymentApi";
import { registerContest, fetchContestDetails } from "../../api/contestApi";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { getErrorMessage } from "../../lib/axios";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const StripeCheckoutForm = ({ clientSecret, onSuccess, disabled }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { handleSubmit } = useForm();

  const submitCard = async () => {
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(submitCard)}>
      <div className="rounded-xl border border-[var(--border)] p-3">
        <CardElement />
      </div>
      <button type="submit" className="btn btn-primary w-full" disabled={disabled || !stripe}>
        Confirm Payment
      </button>
    </form>
  );
};

export const PaymentContestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [intentData, setIntentData] = useState(null);

  const { data: contest, isLoading } = useQuery({
    queryKey: ["contest-details", id, "payment"],
    queryFn: () => fetchContestDetails(id),
  });

  const registerMutation = useMutation({
    mutationFn: (paymentIntentId) => registerContest({ contestId: id, paymentIntentId }),
    onSuccess: () => {
      toast.success("Contest registration completed");
      navigate(`/contest/${id}`);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Registration failed")),
  });

  const createIntentMutation = useMutation({
    mutationFn: () => createContestPaymentIntent(id),
    onSuccess: (data) => {
      const useMock = !data?.clientSecret || data.clientSecret.startsWith("mock_secret_");
      if (useMock) {
        registerMutation.mutate(data.paymentIntentId);
        return;
      }
      setIntentData(data);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Failed to initialize payment")),
  });

  const usingMock = !intentData?.clientSecret || intentData.clientSecret.startsWith("mock_secret_");

  if (isLoading) return <LoadingSpinner full />;

  return (
    <section className="section-space">
      <div className="container-pad">
        <div className="card mx-auto max-w-2xl space-y-5 p-6 md:p-8">
          <h2 className="text-3xl font-black">Contest Payment</h2>
          <p className="text-[var(--text-soft)]">
            Contest: <span className="font-semibold text-[var(--text)]">{contest?.name}</span>
          </p>
          <p>
            Entry Fee: <span className="font-semibold text-[var(--accent)]">${contest?.entryFee}</span>
          </p>
          <p className="text-sm text-[var(--text-soft)]">Logged in as {user?.email}</p>

          {!intentData ? (
            <button
              type="button"
              className="btn btn-primary w-full"
              onClick={() => createIntentMutation.mutate()}
              disabled={createIntentMutation.isPending || registerMutation.isPending}
            >
              {createIntentMutation.isPending || registerMutation.isPending ? "Processing..." : "Initialize Payment"}
            </button>
          ) : null}

          {intentData ? (
            usingMock || !stripePromise ? (
              <button
                type="button"
                className="btn btn-accent w-full"
                onClick={() => registerMutation.mutate(intentData.paymentIntentId)}
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Processing..." : "Complete Mock Payment"}
              </button>
            ) : (
              <Elements stripe={stripePromise} options={{ clientSecret: intentData.clientSecret }}>
                <StripeCheckoutForm
                  clientSecret={intentData.clientSecret}
                  disabled={registerMutation.isPending}
                  onSuccess={(paymentIntentId) => registerMutation.mutate(paymentIntentId)}
                />
              </Elements>
            )
          ) : null}
        </div>
      </div>
    </section>
  );
};

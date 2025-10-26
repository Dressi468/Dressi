import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, UserRound } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { apiUrl } from "../lib/api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>\\/~`_[\]\-+=]).{8,}$/;

const SECURITY_QUESTION_OPTIONS = [
  { value: "favorite_food", label: "What is your favorite food?" },
  { value: "birth_city", label: "What city were you born in?" },
  { value: "first_pet", label: "What is the name of your first pet?" },
];

function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

function isStrongPassword(value: string): boolean {
  return PASSWORD_PATTERN.test(value);
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotValues, setForgotValues] = useState({
    email: "",
    securityQuestion: "",
    securityAnswer: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formValues.email || !formValues.password) {
      setError("Please enter both email and password.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl("/api/login_mongo/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formValues.email,
          password: formValues.password,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          typeof payload?.error === "string" && payload.error.trim()
            ? payload.error
            : "Unable to sign you in. Please try again.";
        throw new Error(message);
      }

      const email = payload?.user?.email || formValues.email;
      const displayName = payload?.user?.displayName || email.split("@")[0];

      login({
        email,
        displayName,
        token: payload?.access,
        refreshToken: payload?.refresh,
        isAdmin: payload?.user?.isAdmin === true,
      });

      navigate("/profile", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleForgotPassword = () => {
    setForgotError(null);
    setForgotSuccess(null);
    setIsForgotPasswordOpen(prev => {
      const next = !prev;
      if (!prev) {
        setForgotValues(current => ({
          ...current,
          email: formValues.email,
        }));
      }
      return next;
    });
  };

  const handleForgotChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForgotValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleForgotSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = forgotValues.email.trim();
    const securityQuestion = forgotValues.securityQuestion;
    const securityAnswer = forgotValues.securityAnswer.trim();
    const newPassword = forgotValues.newPassword;
    const confirmPassword = forgotValues.confirmPassword;

    if (!email) {
      setForgotError("Please enter the email associated with your account.");
      setForgotSuccess(null);
      return;
    }

    if (!isValidEmail(email)) {
      setForgotError("Please enter a valid email address.");
      setForgotSuccess(null);
      return;
    }

    if (!securityQuestion) {
      setForgotError("Please choose your security question.");
      setForgotSuccess(null);
      return;
    }

    if (!securityAnswer) {
      setForgotError("Please provide the answer to your security question.");
      setForgotSuccess(null);
      return;
    }

    if (!newPassword) {
      setForgotError("Please enter a new password.");
      setForgotSuccess(null);
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setForgotError(
        "New password must be at least 8 characters, include an uppercase letter and a special character."
      );
      setForgotSuccess(null);
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError("New password and confirmation do not match.");
      setForgotSuccess(null);
      return;
    }

    setForgotError(null);
    setForgotSuccess(null);
    setIsResetting(true);

    try {
      const response = await fetch(apiUrl("/api/forgot_password/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          securityQuestion,
          securityAnswer,
          newPassword,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          typeof payload?.error === "string" && payload.error.trim()
            ? payload.error
            : "We couldn't reset your password. Please try again.";
        throw new Error(message);
      }

      const successMessage =
        typeof payload?.message === "string" && payload.message.trim()
          ? payload.message.trim()
          : "Password updated successfully. You can now sign in with your new password.";

      setForgotValues(prev => ({
        ...prev,
        email,
        securityAnswer: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setFormValues(prev => ({
        ...prev,
        email,
        password: "",
      }));

      try {
        const loginResponse = await fetch(apiUrl("/api/login_mongo/"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password: newPassword,
          }),
        });

        const loginPayload = await loginResponse.json().catch(() => ({}));

        if (!loginResponse.ok) {
          const message =
            typeof loginPayload?.error === "string" && loginPayload.error.trim()
              ? loginPayload.error.trim()
              : "Password reset succeeded, but automatic sign in failed. Please sign in manually with your new password.";
          throw new Error(message);
        }

        const loggedInEmail = loginPayload?.user?.email || email;
        const displayName =
          loginPayload?.user?.displayName ||
          (loggedInEmail.includes("@") ? loggedInEmail.split("@")[0] : loggedInEmail);

        login({
          email: loggedInEmail,
          displayName,
          token: loginPayload?.access,
          refreshToken: loginPayload?.refresh,
          isAdmin: loginPayload?.user?.isAdmin === true,
        });

        navigate("/profile", { replace: true });
        return;
      } catch (loginErr) {
        const message =
          loginErr instanceof Error
            ? loginErr.message
            : "Password reset succeeded, but automatic sign in failed. Please sign in manually with your new password.";
        setForgotSuccess(successMessage);
        setForgotError(message);
        return;
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setForgotError(message);
      setForgotSuccess(null);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-3.5rem)] flex-col overflow-hidden bg-[#04030f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.18),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(236,72,153,0.2),_transparent_50%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "linear-gradient(135deg, rgba(5,8,20,0.9) 0%, rgba(5,8,20,0.35) 40%, rgba(11,3,28,0.65) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 sm:px-8">
        <div className="relative mx-auto mt-6 flex w-full max-w-md flex-1 items-start justify-center">
          <div className="absolute -top-16 h-56 w-56 rounded-full bg-pink-500/30 blur-3xl" />
          <div className="absolute -bottom-20 right-2 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative z-10 w-full rounded-[28px] border border-white/10 bg-[#090b1c]/80 p-8 shadow-[0_40px_120px_rgba(12,10,30,0.45)] backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-500 text-white shadow-lg">
              <UserRound className="h-8 w-8" />
            </div>
            <header className="mt-6 text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm text-white/70">
                Sign in to continue your style journey
              </p>
            </header>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-white/80"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="pointer-events-none absolute left-4 h-4 w-4 text-white/50" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    value={formValues.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-base text-white placeholder:text-white/40 outline-none transition focus:border-pink-400/80 focus:ring-2 focus:ring-pink-400/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold text-white/80"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="pointer-events-none absolute left-4 h-4 w-4 text-white/50" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    value={formValues.password}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-12 text-base text-white placeholder:text-white/40 outline-none transition focus:border-pink-400/80 focus:ring-2 focus:ring-pink-400/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 text-sm font-semibold text-white/60 transition hover:text-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-4 py-3 text-center text-base font-semibold text-white transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>

              {error ? (
                <p className="text-center text-sm text-rose-300">{error}</p>
              ) : null}
            </form>

            <button
              type="button"
              onClick={toggleForgotPassword}
              className="mt-4 w-full text-sm font-semibold text-white/70 transition hover:text-white focus:outline-none"
            >
              {isForgotPasswordOpen ? "Hide forgot password" : "Forgot password?"}
            </button>

            {isForgotPasswordOpen ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-lg font-semibold text-white">Reset your password</h2>
                <p className="mt-1 text-xs text-white/60">
                  Answer your security question to create a new password.
                </p>
                <form className="mt-4 space-y-4" onSubmit={handleForgotSubmit} noValidate>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-white/60" htmlFor="forgot-email">
                      Email
                    </label>
                    <input
                      id="forgot-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      value={forgotValues.email}
                      onChange={handleForgotChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-pink-400/80 focus:ring-2 focus:ring-pink-400/30"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-white/60" htmlFor="forgot-security-question">
                      Security question
                    </label>
                    <select
                      id="forgot-security-question"
                      name="securityQuestion"
                      required
                      value={forgotValues.securityQuestion}
                      onChange={handleForgotChange}
                      className="select-light-options w-full rounded-2xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white outline-none transition focus:border-pink-400/80 focus:ring-2 focus:ring-pink-400/30"
                    >
                      <option value="">Select a security question</option>
                      {SECURITY_QUESTION_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-white/60" htmlFor="forgot-security-answer">
                      Answer
                    </label>
                    <input
                      id="forgot-security-answer"
                      name="securityAnswer"
                      type="text"
                      placeholder="Enter your answer"
                      autoComplete="off"
                      required
                      value={forgotValues.securityAnswer}
                      onChange={handleForgotChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-pink-400/80 focus:ring-2 focus:ring-pink-400/30"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-white/60" htmlFor="forgot-new-password">
                      New password
                    </label>
                    <input
                      id="forgot-new-password"
                      name="newPassword"
                      type="password"
                      placeholder="Create a new password"
                      autoComplete="new-password"
                      required
                      value={forgotValues.newPassword}
                      onChange={handleForgotChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-pink-400/80 focus:ring-2 focus:ring-pink-400/30"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-white/60" htmlFor="forgot-confirm-password">
                      Confirm new password
                    </label>
                    <input
                      id="forgot-confirm-password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Repeat your new password"
                      autoComplete="new-password"
                      required
                      value={forgotValues.confirmPassword}
                      onChange={handleForgotChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-pink-400/80 focus:ring-2 focus:ring-pink-400/30"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isResetting ? "Resetting..." : "Reset password"}
                  </button>
                  {forgotError ? (
                    <p className="text-center text-xs text-rose-300">{forgotError}</p>
                  ) : null}
                  {forgotSuccess ? (
                    <p className="text-center text-xs text-emerald-300">{forgotSuccess}</p>
                  ) : null}
                </form>
              </div>
            ) : null}

            <div className="mt-8 flex items-center gap-4 text-white/40">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs uppercase tracking-[0.3em]">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <p className="mt-6 text-center text-sm text-white/70">
              Don&apos;t have an account?{" "}
              <Link
                className="font-semibold text-pink-300 transition hover:text-pink-200"
                to="/signup"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

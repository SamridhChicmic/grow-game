import api from "@/api/axios";
import { Button, Input, Spinner } from "@/components";
import { AxiosError } from "axios";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Verify Email");
  const params = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    retypedPassword: false,
  });

  const [passwords, setPasswords] = useState({
    newPassword: "",
    retypedPassword: "",
  });

  useEffect(() => {
    if (!params.token) {
      navigate("/");
      return;
    }
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.retypedPassword)
      return toast.error("Passwords don't match");

    try {
      setLoading(true);
      const response = await api.post(`/auth/reset/${params.token}`, passwords);
      const data = response.data;
      if (response.status === 200 || response.status === 201) {
        setMessage(data.message);
        toast.success("Password reset successfully");
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      console.error("VERIFY_EMAIL: ", error);
      toast.error(err.response?.data.message || "an error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div
        className={clsx(
          "w-[98%] justify-center overflow-y-auto overscroll-contain items-center sm:w-[60vw] lg:w-[30rem] p-3 sm:shadow-md sm:shadow-dark-650 sm:rounded outline outline-1 outline-dark-650",
        )}
      >
        <form onSubmit={handleSubmit} className="w-full text-center space-y-4">
          <fieldset className="gap-1 mt-3 flex flex-col w-full">
            <div className="flex flex-row justify-between">
              <label className="text-white -tracking-[0.28px] font-normal text-[14px]">
                New Password
              </label>
            </div>
            <Input
              type="password"
              name="new-password"
              value={passwords?.newPassword}
              onChange={(e) =>
                setPasswords((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              placeholder="Enter new password"
            />
          </fieldset>
          <fieldset className="gap-1 mt-3 flex flex-col w-full">
            <div className="flex flex-row justify-between w-full">
              <label className="text-white -tracking-[0.28px] font-normal text-[14px]">
                Retype Password
              </label>
            </div>
            <Input
              type="password"
              name="retype-password"
              value={passwords?.retypedPassword}
              onChange={(e) =>
                setPasswords((prev) => ({
                  ...prev,
                  retypedPassword: e.target.value,
                }))
              }
              placeholder="Retype Password"
              className={clsx(
                passwords.newPassword &&
                  passwords.retypedPassword &&
                  passwords.newPassword === passwords.retypedPassword &&
                  "[&>input]:!outline-green-500 focus:[&>input]:outline-green-500",
              )}
            />
          </fieldset>
          <Button className="w-full !py-2" loading={loading}>
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}

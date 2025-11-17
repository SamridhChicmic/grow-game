import api from "@/api/axios";
import { Button, Spinner } from "@/components";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [end, setEnd] = useState(false);
  const [message, setMessage] = useState("Verify Email");
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!params.token) {
      navigate("/");
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setMessage("Please wait, Your email is being Verified");
        const response = await api.post(`/auth/verify/${params.token}`);
        const data = response.data;
        if (response.status === 200 || response.status === 201) {
          setVerified(true);
          setMessage(data.message);
          toast.success("Email verified successfully");
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        console.error("VERIFY_EMAIL: ", error);
        toast.error(err.response?.data.message || "an error occurred");
      } finally {
        setLoading(false);
        setMessage("Continue to site");
        setEnd(true);
      }
    })();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full text-center space-y-4">
        <h1>{message}</h1>
        <div className="w-fit mx-auto ">
          {loading && (
            <Spinner className="!border-[#4483EB_#4483EB_transparent] !w-10 !h-10" />
          )}
          {(verified || end) && (
            <Link to={"/"} className="">
              <Button className="px-12 py-3">Continue to site</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

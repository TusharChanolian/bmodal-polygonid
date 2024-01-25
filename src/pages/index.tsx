import { useMemo } from "react";
import useGenerateQrCode from "@/hooks/useGenerateQrCode";
import useCheckForResponse from "@/hooks/useVerificationResponse";
import { useQRCode } from "next-qrcode";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  // Generate a unique session ID using uuid library.
  const sessionId = useMemo(() => uuidv4(), []);

  // Used to render the QR code.
  const { Canvas } = useQRCode();

  const {
    data: qrCode,
    isLoading: loadingQrCode,
    isError: qrCodeError,
  } = useGenerateQrCode(sessionId);

  const { data: verificationResponse } = useCheckForResponse(
    sessionId,
    !!qrCode
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-5 pt-24 text-center">
      <div className="radial-gradient absolute blur-3xl rounded-full opacity-10 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 z-0 h-64 w-1/2 top-8 left-1/4 " />

      {/* Render the QR code with loading + error states */}
      {qrCodeError && (
        <p className="text-center">
          Something went wrong generating the QR code.
        </p>
      )}
      {!qrCodeError && loadingQrCode ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="flex justify-center">
          <Canvas
            text={JSON.stringify(qrCode)}
            options={{
              width: 384,
            }}
          />
        </div>
      )}
      <br></br>

        {/* Render the verification status */}
        <p className="text-center max-w-2xl mb-4 text-2xl">
        {!!verificationResponse ? (
          <span className="text-green-400">Verified</span>
        ) : (
          <span className="text-red-400">Not verified</span>
        )}
      </p>


 
    </main>
  );
}

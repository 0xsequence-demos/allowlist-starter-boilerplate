import { useAccount, useSignMessage } from "wagmi";
import {
  AUDIENCE_ID,
  useIsAudienceContactRegistered,
  useRegisterAudienceContact,
} from "./useAudience";
import { useSignInEmail } from "@0xsequence/kit";
import { useToast } from "@0xsequence/design-system";
import { useQueryClient, useQuery } from "@tanstack/react-query";

export const useRegisterUser = () => {
  const { signMessageAsync } = useSignMessage();
  const { address, chainId } = useAccount();
  const { mutateAsync: isAudienceContactRegistered } =
    useIsAudienceContactRegistered();
  const { mutateAsync: registerAudienceContact } = useRegisterAudienceContact();
  const email = useSignInEmail();
  const toast = useToast();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["userRegistration", email, address],
    queryFn: async () => {
      if (!email || !address || !chainId) {
        return { isRegistered: false };
      }

      try {
        const registered = await isAudienceContactRegistered(address);

        if (!registered) {
          const message = "wallet with address " + address;
          const response = await signMessageAsync({
            message: message,
          });

          const proof = {
            address: address,
            message: message,
            signature: response,
            chainId: chainId,
          };

          if (!proof || !proof.signature) {
            return { isRegistered: false };
          }

          await registerAudienceContact({
            contact: {
              address: address,
              email: email,
              audienceId: AUDIENCE_ID,
            },
            walletProof: proof,
          });

          toast({
            title: "User registered",
            description: "User registered successfully",
            variant: "success",
          });

          queryClient.invalidateQueries({ queryKey: ["audienceStatus"] });
        }
        return { isRegistered: true };
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Error registering user",
          variant: "error",
        });
        return { isRegistered: false };
      }
    },
    enabled: !!email && !!address,
  });
};

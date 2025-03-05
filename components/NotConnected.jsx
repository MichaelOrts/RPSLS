import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

const NotConnected = () => {
  return (
    <Alert variant="destructive">
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        Please connect your Wallet to our DApp.
      </AlertDescription>
    </Alert>
  )
}

export default NotConnected
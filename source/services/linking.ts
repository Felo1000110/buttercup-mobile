import { Linking } from "react-native";
import { URL, URLSearchParams } from "react-native-url-polyfill";
import joinURL from "url-join";
import { getEmitter as getDropboxEmitter } from "./dropbox";
import { notifyError, notifySuccess } from "../library/notifications";
import { storePendingOTPURI } from "./otp";

const URI_PROTO_BUTTERCUP = "buttercup://";
const URI_PROTO_OTPAUTH = "otpauth://";

// Example Buttercup redirect:
//  buttercup://auth/dropbox/#token_type=bearer&
//      access_token=onP0etlMO--snip--&
//      uid=2--snip--&
//      account_id=dbid%3AAAD--snip--

function extractHashProperties(url: URL): { [key: string]: string } {
    const hashProps = (url.hash || "").replace(/^#/, "").split("&");
    return hashProps.reduce((output, keyVal: string) => {
        const [key, value] = keyVal.split("=");
        return {
            ...output,
            [key]: value
        };
    }, {});
}

function handleURLChange(url: string) {
    if (!url) return;
    const lowerURL = url.toLowerCase();
    if (lowerURL.indexOf(URI_PROTO_BUTTERCUP) === 0) {
        processButtercupURL(new URL(url));
    } else if (lowerURL.indexOf(URI_PROTO_OTPAUTH) === 0) {
        const stored = storePendingOTPURI(url);
        if (stored) {
            notifySuccess("OTP Payload Received", "Edit an entry to save it.");
        }
    } else {
        notifyError("Unrecognised URI", "Buttercup received an unrecognised URI request.");
    }
}

export async function initialise() {
    const initialURL = await Linking.getInitialURL();
    if (initialURL) {
        handleURLChange(initialURL);
    }
    const urlChangeHandler = ({ url }: { url: string }) => {
        handleURLChange(url);
    };
    Linking.addEventListener("url", urlChangeHandler);
}

function normaliseButtercupPath(url: URL) {
    return joinURL("/", url.host, url.pathname).replace(/\/+$/, "");
}

function processButtercupURL(url: URL) {
    switch (normaliseButtercupPath(url)) {
        case "/auth/dropbox": {
            const {
                access_token: accessToken
            } = extractHashProperties(url);
            getDropboxEmitter().emit("token", { token: accessToken });
            break;
        }
        default:
            console.warn("Unrecognised URL", url.toString());
            break;
    }
}


import { StyleSheet, Dimensions } from "react-native";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

// Login styles
const styles = StyleSheet.create({
    header: {
        marginHorizontal: 40,
        padding: 10,
        marginTop: 50,
        width: WIDTH - 200,
        marginBottom: 50
    },
    welcomeHeader: {
        marginHorizontal: 70,
        padding: 10,
        marginTop: 100,
        width: WIDTH - 150,
        marginBottom: 50
    },
    welcomeHeaderText: {
        fontSize: 20,
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center"
    },
    welcomeHeaderSubText: {
        color: "#999",
        textAlign: "center"
    },
    headerText: {
        fontSize: 30,
        color: "#fff",
        fontWeight: "bold"
    },
    headerSubText: {
        color: "#999"
    },
    inputStyle: {
        borderBottomColor: "rgba(255, 255, 255, 0.2)",
        borderBottomWidth: 1,
        height: 40,
        fontSize: 12,
        color: "#fff"
    },
    textLabels: {
        color: "#999"
    },
    inputCoverStyle: {
        marginHorizontal: 50,
        width: WIDTH - 90
    },
    logoStyle: {
        position: "absolute",
        zIndex: 100,
        right: 90,
        top: 100
    },
    inputInnerStyle: {
        marginTop: 16
    },
    loginBtn: {
        height: 45,
        backgroundColor: "#e3e3e3",
        marginTop: 20,
        borderRadius: 30
    },
    loginBtnText: {
        textAlign: "center",
        marginTop: 12,
        color: "#666"
    },
    viewContainer: {
        backgroundColor: "#404452",
        height: HEIGHT
    },
    welcomeViewContainer: {
        backgroundColor: "#404452",
        height: HEIGHT
    },
    forgoPssText: {
        textAlign: "right",
        color: "#999"
    },
    divider: {
        borderBottomColor: "rgba(255, 255, 255, 0.3)",
        borderBottomWidth: 1,
        marginTop: 10,
        width: WIDTH - 297
    },
    welcomeDivider: {
        borderBottomColor: "rgba(255, 255, 255, 0.3)",
        borderBottomWidth: 1,
        marginTop: 10,
        width: WIDTH - 297,
        marginHorizontal: 70
    },
    createAccount: {
        color: "#999"
    },
    createAccountContainer: {
        width: "50%",
    },
    forgotPassContainer: {
        width: "50%",
    },
    logo: {
        marginHorizontal: 100
    },
    loginBtnWelcome: {
        height: 45,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        marginTop: 20,
        width: WIDTH - 150,
        marginHorizontal: 28
    },
    loginBtnTextWelcome: {
        textAlign: "center",
        marginTop: 12,
        color: "#666"
    },
});

module.exports = { styles };
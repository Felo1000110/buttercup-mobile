import React from "react";
import { SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { withStyles } from "@ui-kitten/components";
import { useState as useHookState } from "@hookstate/core";
import { OTPProvider } from "../../contexts/otp";
import { HomeScreen } from "../screens/HomeScreen";
import { VaultManagementScreen } from "../screens/VaultManagementScreen";
import { AboutScreen } from "../screens/AboutScreen";
import { AddVaultScreen } from "../screens/AddVaultScreen";
import { VaultContentsScreen } from "../screens/VaultContentsScreen";
import { EntryDetailsScreen } from "../screens/EntryDetailsScreen";
import { EditEntryScreen } from "../screens/EditEntryScreen";
import { CoverScreen } from "../screens/CoverScreen";
import { VaultNavigator } from "./VaultNavigator";
import { useSourceOTPItems } from "../../hooks/otp";
import { CURRENT_SOURCE } from "../../state/vault";
import { rootNavigationRef } from "../../state/navigation";

const { Navigator, Screen } = createStackNavigator();

const HomeNavigator = () => (
    <Navigator headerMode="none">
        <Screen name="Home" component={HomeScreen} />
        <Screen name="About" component={AboutScreen} />
        <Screen name="Vault" component={VaultNavigator} />
        <Screen name="AddVault" component={AddVaultScreen} />
        <Screen name="ManageVaults" component={VaultManagementScreen} />
        {/* */}
        <Screen name="VaultContents" component={VaultContentsScreen} />
        <Screen name="EntryDetails" component={EntryDetailsScreen} />
        <Screen name="EditEntry" component={EditEntryScreen} />
        {/* */}
        <Screen name="Cover" component={CoverScreen} />
    </Navigator>
);

const _ThemedSafeAreaView = ({ eva }) => (
    <SafeAreaView
        style={{
            flex: 0,
            backgroundColor: eva.theme["background-basic-color-1"]
        }}
    />
);
const ThemedSafeAreaView = withStyles(_ThemedSafeAreaView);

export function AppNavigator({ eva }) {
    const currentSourceState = useHookState(CURRENT_SOURCE);
    const sourceOTPItems = useSourceOTPItems(currentSourceState.get());
    return (
        <NavigationContainer ref={rootNavigationRef}>
            <ThemedSafeAreaView eva={eva} />
                <OTPProvider otpItems={sourceOTPItems}>
                    <HomeNavigator />
                </OTPProvider>
            <ThemedSafeAreaView eva={eva} />
        </NavigationContainer>
    );
}
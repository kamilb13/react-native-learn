import React, {useContext, useEffect, useState} from 'react';
import { NativeBaseProvider, Box, Text, Button, Center } from 'native-base';

import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "@firebase/auth";
import {ScrollView} from "react-native";
import AuthenticatedScreen from "./AuthenticatedScreen";
import AuthScreen from "./AuthScreen";
import {AuthContext} from "./Auth/AuthContext";

function WelcomeScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const { auth } = useContext(AuthContext);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, [auth]);

    console.log("USER(null)",user);

    const handleAuthentication = async () => {

        try {
            if (user) {
                await signOut(auth);
                console.log('User logged out successfully!');
                setUser(null);
            } else {
                if (isLogin) {
                    await signInWithEmailAndPassword(auth, email, password);
                    console.log('User signed in successfully!');
                    //setIsLogin(!isLogin);
                } else {
                    await createUserWithEmailAndPassword(auth, email, password);
                    console.log('User created successfully!');
                }
            }
        } catch (error) {
            switch (error.code){
                case 'auth/invalid-email':
                    setErrorMessage('Invalid email format.');
                    break;
                case 'auth/user-not-found':
                    setErrorMessage('User not found. Please register.');
                    break;
                case 'auth/wrong-password':
                    setErrorMessage('Incorrect password. Please try again.');
                    break;
                case 'auth/email-already-in-use':
                    setErrorMessage('This email is already in use. Please log in.');
                    break;
                case 'auth/invalid-credential':
                    setErrorMessage('Invalid cridencial.');
                    break;
                default:
                    setErrorMessage('Authentication error: ' + error.message);
                    console.log(error.code)
            }
        }
    };

    return (
        <NativeBaseProvider>
            <Center flex={1} px={4}>
                <Box alignItems="center" width="100%">
                    {errorMessage ? <Text>{errorMessage}</Text> : null}
                    {user ? (
                        <AuthenticatedScreen
                            navigation={navigation}
                            user={user}
                            handleAuthentication={handleAuthentication}
                        />
                    ) : (
                        <AuthScreen
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            isLogin={isLogin}
                            setIsLogin={setIsLogin}
                            handleAuthentication={handleAuthentication}
                        />
                    )}
                </Box>
            </Center>
        </NativeBaseProvider>


    );
}

export default WelcomeScreen;

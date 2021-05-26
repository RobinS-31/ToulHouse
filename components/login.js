// == Import : npm
import { useState, useEffect, useRef } from "react";
import { signIn, useSession } from 'next-auth/client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faAt } from "@fortawesome/free-solid-svg-icons";


/**
 * Gère l'affichage de la page de connexion.
 * @returns {JSX.Element}
 */
const Login = () => {
    const signupModal = useRef(null);
    const [email, setEmail] = useState("");
    const [isModal, setIsModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSessionError, setIsSessionError] = useState(false);
    const [session, loading] = useSession();

    useEffect(() => {
        window.onclick = (e) => {
            if (e.target.id === "signupModal") {
                setIsModal(false);
                setEmail("");
                isSessionError ? setIsSessionError(false) : null;
            }
        };

        return () => {
            window.onclick = null;
        };
    }, []);

    useEffect(() => {
        handleSignupModal();
    }, [isModal]);

    /**
     * Gère l'affichage de la fenêtre modale.
     */
    const handleSignupModal = () => {
        if (isModal) {
            signupModal.current.style.display = "flex";
            setTimeout(() => {
                signupModal.current.classList.add('show');
                signupModal.current.setAttribute('aria-hidden', false);
            }, 50);
        } else {
            signupModal.current.classList.remove('show');
            signupModal.current.setAttribute('aria-hidden', true);
            setTimeout(() => {
                signupModal.current.style.display = "none";
            },150);
        }
    };

    /**
     * Gère l'affichage de l'input du formulaire "Signin".
     * @param e
     */
    const handleInputFocusAndBlur = (e) => {
        if (e._reactName === "onFocus") {
            e.currentTarget.labels[0].classList.add('active');
        }
        if (e._reactName === "onBlur" && e.currentTarget.value.length === 0) {
            e.currentTarget.labels[0].classList.remove('active');
        }
    };

    /**
     * Gère la soumission du formulaire "Signin".
     * @param e
     */
    const handleSubmitLoginForm = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const signinPromise = await signIn('email', { email, redirect: false, callbackUrl: "/" });

        if (signinPromise.status === 200) {
            setIsModal(true);
            setIsLoading(false);
        } else {
            setIsModal(true);
            setIsSessionError(true);
            setIsLoading(false);
        }
    };

    return (
        <div className="section login">
            <div className="sectionTitle">
                <h2>Se Connecter</h2>
            </div>
            <div className="loginContent">
                <section className="signin">
                    <form className="loginForm signinForm">
                        <div className="loginFormContent signinFormContent">
                            <input
                                className="loginFormInput"
                                id="emailSignin"
                                name="emailSignin"
                                type="email"
                                value={email}
                                required
                                onFocus={handleInputFocusAndBlur}
                                onBlur={handleInputFocusAndBlur}
                                onChange={e => setEmail(e.currentTarget.value)}
                            />
                            <label
                                className="loginFormLabel"
                                htmlFor="emailSignin"
                            >
                                Adresse Email
                            </label>
                            <FontAwesomeIcon
                                icon={faAt}
                                className="loginFormIcon"
                            />
                        </div>
                        <button
                            className="loginFormButton"
                            type="submit"
                            onClick={handleSubmitLoginForm}
                        >
                            {
                                isLoading
                                    ? <div className='spinnerLoader' />
                                    : "Se Connecter"
                            }
                        </button>
                    </form>
                </section>
                <section className="signup">
                    <div>
                        <h3 className="signupTitle">Déja inscrit ?</h3>
                        <p className="signupExplication">Vous pouvez vous connecter via votre addresse email, un email vous sera envoyé pour valider votre connexion.</p>
                    </div>
                    <div>
                        <h3 className="signupTitle">Vous n'avez pas encore de compte ?</h3>
                        <p className="signupExplication">Indiquez votre adresse email puis cliquez sur "Se Connecter", votre compte sera créé et un email vous sera envoyé pour valider votre connexion. </p>
                    </div>
                    <div
                        className="signupModal"
                        id="signupModal"
                        role="dialog"
                        aria-label="Fenêtre indiquant de vérifier sa boîte de réception afin de valider le mail de connexion"
                        aria-modal="true"
                        aria-hidden="true"
                        tabIndex="-1"
                        ref={signupModal}
                    >
                        <div className="signupModalDialog" role="document">
                            <div className="signupModalDialogContent">
                                <h4 className="signupModalDialogContentTitle">
                                    {
                                        isSessionError
                                            ? 'Une érreur est survenue'
                                            : 'Vérifiez votre boite de réception'
                                    }
                                </h4>
                                <p className="signupModalDialogContentText">
                                    {
                                        isSessionError
                                            ? 'Veuillez éssayer à nouveau de vous connecter. Si l\'érreur persiste contactez un administrateur via le lien "Nous contacter" qui se trouve en bas de page.'
                                            : `Un lien pour valider votre connexion vous a été envoyé à l'adresse : ${email}`
                                    }
                                </p>
                            </div>
                            <button
                                className="signupModalDialogCloseButton"
                                name="closeRegisterModal"
                                aria-label="Fermer"
                                title="Fermer cette fenêtre modale"
                                onClick={() => {
                                    setIsModal(false);
                                    setEmail("");
                                    isSessionError ? setIsSessionError(false) : null;
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faTimes}
                                />
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Login;

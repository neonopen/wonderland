// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default class XXSignUp extends React.Component {
    constructor(props) {
        super(props);

        this.updateField = this.updateField.bind(this);

        this.state = {
            name: '',
            email: '',
            password: '',
            passwordVerify: '',
        };
    }

    updateField(field, value) {
        this.setState({
            [field]: value,
        });
    }

    render() {
        const { updateField } = this;
        const { onClose } = this.props;
        const { name, email, password, passwordVerify } = this.state;

        const isValid = name && email && password && passwordVerify && (password === passwordVerify);

        const sendClassName = ['xxButton', 'xxButton--highlight'];
        if (isValid) {
            sendClassName.push('xxButton--important');
        }

        const verifyPasswordClassName = ['xxFormField'];
        if (passwordVerify && password !== passwordVerify) {
            verifyPasswordClassName.push('has-error');
        }

        return (
            <div className="xxPageOverlay-content">
                <h1 className="xxSubtitle">Sign Up</h1>
                <h2 className="xxTitle">Analyze More Videos</h2>
                <div className="xxText">
                    <p>Create a free account to analyze more videos, see more NeonScores, and understand how images work.</p>
                </div>
                <div className="xxFormField">
                    <label className="xxLabel">Your Name</label>
                    <input
                        className="xxInputText"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={e => updateField('name', e.target.value)}
                    />
                </div>
                <div className="xxFormField">
                    <label className="xxLabel">Your Email</label>
                    <input
                        className="xxInputText"
                        type="text"
                        placeholder="example@email.com"
                        value={email}
                        onChange={e => updateField('email', e.target.value)}
                    />
                </div>
                <div className="xxFormField">
                    <label className="xxLabel">Password</label>
                    <input
                        className="xxInputText"
                        type="password"
                        placeholder="••••••••••"
                        value={password}
                        onChange={e => updateField('password', e.target.value)}
                    />
                </div>
                <div className={verifyPasswordClassName.join(' ')}>
                    {
                        passwordVerify && password !== passwordVerify ? (
                            <strong className="xxFormError">
                                Passwords do not match.
                            </strong>
                        ) : null
                    }
                    <label className="xxLabel">Verify Password</label>
                    <input
                        className="xxInputText"
                        type="password"
                        placeholder="••••••••••"
                        value={passwordVerify}
                        onChange={e => updateField('passwordVerify', e.target.value)}
                    />
                </div>
                <div className="xxFormButtons">
                    <button
                        className="xxButton"
                        type="button"
                        onClick={() => onClose('')}
                    >Back</button>
                    <button
                        disabled={!isValid}
                        className={sendClassName.join(' ')}
                        type="button"
                        onClick={isValid ? (() => onClose('has-account')) : null}
                    >Sign Up</button>
                </div>
            </div>
        );
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

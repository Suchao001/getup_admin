import React, { useContext, useEffect } from 'react';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';

function IsLogin({ page }) {
    const { isLogin, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return; 
        if (!isLogin) {
            navigate('/');
        }
    }, [isLogin, navigate, loading]);

    return (
        <>
            {isLogin && !loading ? page : null}
        </>
    );
}

export default IsLogin;

import GoogleButton from "../GoogleButton";

function SignIn() {
    return (
        <>
            <form id="form-sign-in">
                <div className="form-group">

                    <input id="email" name="email" type="text" className="form-control" placeholder="Email" />
                    <span className="form-message"></span>
                </div>
                <div className="form-group">
                    <input id="password" name="password" type="password" className="form-control" placeholder="Password" />
                    <span className="form-message"></span>
                </div>
                <button type="submit" id="signIn-btn" className="btn btn-outline-dark btn-block">Sign In</button>

                {/* Add a horizontal line and the text "Hoặc tiếp tục với:" */}
                <div className="form-group text-center mt-4">
                    <hr />
                    <span className="text-muted">or continue with</span>
                </div>

                {/* Include the GoogleButton component here */}
                <GoogleButton />
            </form>
        </>
    );

}

export default SignIn;

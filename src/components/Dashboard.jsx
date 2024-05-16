import { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Dashboard = (props) => {
    const [data, setData] = useState({
        app: props.app,
        user: props.user
    });

    
    onAuthStateChanged(getAuth(data.app), async (user) => {
        console.log(user)
        if (user) {
                <>
                    <h1>Test</h1>
                </>
        // const displayElements = new DisplayElements(user, this.app); 
        } else {
        //   window.location.href = "/index.html";
        }
      });
}

export default Dashboard
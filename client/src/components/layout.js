
// import Header from './header/header';
// import SideBar from './sidebar/sidebar'
import {useState,createContext} from  "react"
 import "../App.css"

 export const Url = createContext()

function Layout({ children }) {
//   const [expanded , setExpanded] = useState(false)

//   const URL = "https://bassam-monla-ycid.onrender.com"


  return (
    <main className="App">
      {/* <SideBar isCollaps ={setExpanded} Collaps = {expanded}/> */}
     
          <div>
              <div className='Header'>
            {/* <Header /> */}
              </div>
              <div>
                <Url.Provider value={URL}>
                 {children}
                </Url.Provider>
              </div>
          </div>

    </main>
  );
}
export default Layout;

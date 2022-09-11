import { Link } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import '../styles/Navbar.css'
import { UserContext } from '../App'

export default function Navbar() {

    const {state, dispatch} = useContext(UserContext)

    useEffect(()=>{
        
        if(localStorage.getItem('token')==null || localStorage.getItem('token')==='')
            dispatch({type:'NavToggle',payload:false})
        else dispatch({type:'NavToggle', payload: true})
    },[])
    

    function toggle(){
        const toggle= document.querySelector('.toggle')
        const nav= document.querySelector('.nav-link')

        toggle.classList.toggle('active');
        nav.classList.toggle('active');
        
    }

    const LoginProfile= () => {
        if(state) { return (<Link className='nav-comp' to='/profile'>Profile</Link>) }
        else { return (<Link className='nav-comp' to='/login'>Login</Link>) }
    }

    return (
        <>
        <nav className='nav-bar'>
            <h3 className='logo'>Safe Stray Life</h3>
            <div className='nav-link'> 
                <Link className='nav-comp' to='/'>Home</Link>
                <Link className='nav-comp' to='/help'>Help</Link>
                <Link className='nav-comp' to='/volunteer'>Volunteer</Link>
                <Link className='nav-comp' to='/about'>About</Link>
                <LoginProfile/>
            </div>
            <div className='toggle' onClick={toggle}>
                <span className='bar'></span><span className='bar'></span><span className='bar'></span>
            </div>
        </nav>
        <div className="nav-bg">
        <div className="nav-logo">
         <div>
            <h1>Safe Stray Life</h1>
            <p>" An initiative to build a community working in welfare of stray animals. "</p>
        </div>
        </div>
    </div>
    </>
    )
}
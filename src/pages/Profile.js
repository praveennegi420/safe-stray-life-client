import { useState, useEffect } from 'react'
import axios from 'axios'
import Stray from '../components/Stray'
import '../styles/Profile.css'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
    const navigate= useNavigate()
    const [data, setData] = useState({ data:{ avatar:{url:''} }, posts:[] }) 

    useEffect(() => {
        axios.post('https://safestraylife.azurewebsites.net/getprofile', {
            token: localStorage.getItem('token')
        })
            .then(res => { 
                 setData(res.data)
                 })
            .catch(err => {
                console.log(err) 
            }) 
    }, [])

    const removeImage = (id) =>{
        axios.post('https://safestraylife.azurewebsites.net/deletepost',{ id, user: data.data._id })
        .then(res => window.location.reload())
        .catch(err => console.log(err))
    }

    const displayData= data.posts.map(datauni => {
        return <Stray id={datauni._id} key={datauni._id} imgsrc={datauni.img.url} location={datauni.location} contact={datauni.contact} delete={1} handleClick={removeImage}/> 
    })

    const logOut = () => {
        localStorage.setItem('token','')
        navigate('/')
        window.location.reload()
    }

    const beVolunteer= () => {

        axios.post('https://safestraylife.azurewebsites.net/be-volunteer', {volunteer: !data.data.volunteer, token: localStorage.getItem('token') }, { headers: { 'content-type' : 'application/json'} })
        .then(res => { if(res.data.status==='error') alert(res.data.error) })
        .catch(err => console.log(err))
    }

    return(
        <div className='profile'>
            <img className='be-volunteer' onClick={beVolunteer} src={
                data.data.volunteer ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmVIVmLX9jJ7kKWRX5UXj-AnOI9F0kuWPHoQ&usqp=CAU' : 'https://simg.nicepng.com/png/small/238-2384992_click-here-to-volunteer-volunteer-clip-art.png'
            } alt='volunteer'/>
            <div className='profile-box'>
                <img className='profile-img' src={data.data.avatar.url} alt='profile-pic'/>
                <div className='profile-info'>
                    <div className='profile-details'> <h3>Name -</h3> <h4>{data.data.name}</h4> </div>
                    <div className='profile-details'> <h3>Email -</h3> <h4>{data.data.email}</h4> </div>
                    <div className='profile-details'> <h3>Contact -</h3> <h4>{data.data.contact}</h4> </div>
                    <div className='profile-details'> <h3>Address -</h3> <h4>{data.data.address}</h4> </div>                    
                    <div className='profile-details'> <h3>Gender -</h3> <h4>{data.data.gender}</h4> </div>
                    <div className='profile-details'> <h3>D.O.B -</h3> <h4>{data.data.dob}</h4> </div>
                    <div className='profile-details'> <h3>About -</h3> <h4>{data.data.about}</h4> </div>
                </div>
            </div>
            <button className='edit-profile' onClick={()=>navigate('/edit-profile')}>Edit Profile</button>
            <div className='break'></div>
            <div className='profile-posts'>
                <h2>Recent Posts</h2>

                <div className='all-posts'>
                { data.posts && Object.keys(data.posts).length===0 ? <h4 className='post-msg'>No Posts Uploaded</h4> : displayData}
                </div>
            </div>
            <div className='break dwnone'></div>
            <button className='log-out' onClick={logOut}>Log Out</button>
        </div>
    )
}
import { useState, useEffect } from "react"
import axios from "axios"
import Stray from "../components/Stray"
import '../styles/Help.css'
import { useNavigate } from 'react-router-dom'

export default function Help() {
    const dataContent = { location: '', contact: '', about: '', image: { name: '', file: null } }
    const [display, setDisplay] = useState([])
    const [data, setData] = useState(dataContent) 
    const [page, setPage] = useState(1)
    const navigate= useNavigate()

    const fetchData = async () => {
        try {
            const data = await axios.get('https://safe-stray-life-server.vercel.app/help', {
                params: {
                    page
                }
            });
            return data.data;
        } catch (err) {
            console.log('err')
        }
    }

    useEffect(() => {
        fetchData()
            .then(data => setDisplay(data))
            .catch(err => console.log('ERROR OCCURED'));
    }, [page])

    function update(event) {

        const { name, value, files } = event.target
        setData(prev => {
            if (files) return { ...prev, [name]: { file: files[0], name: value } }
            return { ...prev, [name]: value }
        })

    }

    function submitdata(e) {
        e.preventDefault()

        const fileReader= new FileReader()
        fileReader.readAsDataURL(data.image.file)

        fileReader.onload= () => {
            const fileURL= fileReader.result
            const config = { headers: { "content-type": 'application/json' } }
            axios.post('https://safe-stray-life-server.vercel.app/help', {
                location: data.location,
                contact: data.contact,
                about: data.about,
                fileURL,
                token: localStorage.getItem('token')
            }
                , config)
                .then(res => {
                    if (res.data.status === 'error') alert(res.data.message)
                    else {
                        window.location.reload()
                    }
                })
                .catch((err) => alert('Login to upload Credentials'));

        }
    }

    const prevPage = () => {
        setPage(prev => prev > 1 ? prev - 1 : 1)

    }

    const nextPage = () => {
        setPage(prev => display.length===0 ? prev : prev + 1)
    }

    const openPost = (id) =>{
        console.log('clicked')
        axios.post(`https://safe-stray-life-server.vercel.app/post/${id}`,{token: localStorage.getItem('token')})
        .then(res => navigate('/post', {state:{data:res.data.post, user:''}}))
        .catch(err => console.log(err))
    }


    const displayData = display.map(datauni => {
        return <Stray key={datauni._id} id={datauni._id} imgsrc={datauni.img.url} location={datauni.location} contact={datauni.contact} name={display.name} postClick={openPost}/>
    });

    return (
        <>
            <div className="help-top">
                <h1>Save a Stray.</h1>
                <p className="quote">Saving one Voiceless will not change the world, but surely for that one,
                    the world will change forever.</p>
            </div>

            <div className="all-stray">
                { display.length === 0 ? <div className='unavailable'>{page===1 ?<h2>Loading ...</h2> : <h2>Posts Unavailable</h2> } </div> : displayData}
            </div>

            <div className="page-change" >
                <img src='https://th.bing.com/th/id/R.39b629a48026949dcb32ee0fec57ca98?rik=XYX2DzDurfBM%2fw&riu=http%3a%2f%2fcliparts.co%2fcliparts%2fgTe%2fEqL%2fgTeEqL6Kc.png&ehk=av58BqIzGDjnfPc4%2fmV347Kqn0c%2fn8OIjDPj46%2br%2bSU%3d&risl=&pid=ImgRaw&r=0' alt='prev' onClick={prevPage} />
                <img src='https://pluspng.com/img-png/next-button-png-open-pluspng-com-next-button-png-2000.png' alt='prev' onClick={nextPage} />
            </div>

            <div className="help-end">
                <form id="form" onSubmit={submitdata} method='post' encType="multipart/form-data">
                    <label>Location
                        <input type='text' name="location" placeholder="Location of your Locality" value={data.location} onChange={update} required />
                    </label>

                    <label>Contact
                        <input type='number' name="contact" placeholder="+91 93898xxx89" onChange={update} value={data.contact} required />
                    </label>

                    <label>About
                        <input type='textarea' name="about" value={data.about} placeholder="Additonal information about animal." onChange={update} />
                    </label>

                    <label className="upload">Upload Photo
                        <input name="image" type='file' className="upload" onChange={update} required />
                    </label>

                    <input type='submit' className="submit" />
                </form>
                <div className="form-aside">
                    <h2>Help the needy from your Locality.</h2>
                    <p>Upload details of stray animal you see in your surrondings who need any help. Someone from the community will reach out to you via. contact you provide.</p>
                </div>
            </div>
        </>
    )
}
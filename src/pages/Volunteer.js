import { useState, useEffect } from "react"
import axios from "axios"
import Volunteers from '../components/Volunteers'
import { useNavigate } from 'react-router-dom'

export default function Volunteer() {

    const [display, setDisplay] = useState([])
    const [page, setPage] = useState(1)
    const navigate= useNavigate()

    const fetchData = async () => {
        try {
            const data = await axios.get('https://safe-stray-life-server.vercel.app/volunteer', {
                params: { page }
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

    const prevPage = () => {
        setPage(prev => prev > 1 ? prev - 1 : 1)

    }

    const nextPage = () => {
        setPage(prev => display.length === 0 ? prev : prev + 1)
    }

    const openPost = (id) =>{
        console.log('clicked')
        axios.post(`https://safe-stray-life-server.vercel.app/volunteer/${id}`,{token: localStorage.getItem('token')})
        .then(res => navigate('/person', {state:{data:res.data.post, user:''}}))
        .catch(err => console.log(err))
    }

    let id = 0
    const displayData = display.map(datauni => {
        return <Volunteers  key={id++} id={datauni._id} imgsrc={datauni.avatar.url} name={datauni.name} contact={datauni.contact} postClick={openPost}/>
    });

    return (
        <>
            <div className="help-top">
                <h1>Be a change maker.</h1>
                <p>"If you take in a starving dog and make sure it thrives, it will not bite you - This is the fundamental difference between dogs and humans."</p>
            </div>
            <div className="all-stray">
            { display.length === 0 ? <div className='unavailable'>{page===1 ?<h2>Loading ...</h2> : <h2>Posts Unavailable</h2> } </div> : displayData}
            </div>

            <div className="page-change" >
                <img src='https://th.bing.com/th/id/R.39b629a48026949dcb32ee0fec57ca98?rik=XYX2DzDurfBM%2fw&riu=http%3a%2f%2fcliparts.co%2fcliparts%2fgTe%2fEqL%2fgTeEqL6Kc.png&ehk=av58BqIzGDjnfPc4%2fmV347Kqn0c%2fn8OIjDPj46%2br%2bSU%3d&risl=&pid=ImgRaw&r=0' alt='prev' onClick={prevPage} />
                <img src='https://pluspng.com/img-png/next-button-png-open-pluspng-com-next-button-png-2000.png' alt='prev' onClick={nextPage} />
            </div>

            <div className="help-end">
                <div className="form-aside">
                    <h2>Be a Volunteer.</h2>
                    <p>If you care for animals and other creatures that we share this earth with and would like to contribute your efforts that could have a multiplier effect in building a compassionate society in India, come join us as a volunteer.</p>
                </div>
            </div>
        </>
    )
}
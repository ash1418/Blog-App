import {useState,useEffect,useRef,useReducer} from 'react'
import {db} from "../firebaseinit"
import { collection , addDoc ,setDoc, getDocs,doc,onSnapshot} from "firebase/firestore"




function blogsReducer(state,action){
  switch(action.type)
  {
    case "Add":
     return [action.blog,...state];
    case "Remove":
     return state.filter((blog,index)=>index!==action.index);
    default: 
     return [];
    }
}

export default function Blog(){
    // const[Blogs,setBlog]=useState([])
    //instead of usestate we are going to use use reducer because we are changing state over 2 event handlers 
    const[Blogs,dispatch] = useReducer(blogsReducer, [] );

    const[formData,setFormData]=useState({Title:"",Content:""})
    //const [Title,setTitle]=useState("")
    //const [Content,setContent]=useState("")
    const titleRef=useRef(null);
    useEffect(()=>{titleRef.current.focus()},[])
    
    useEffect(()=>{
      if(Blogs.length && Blogs[0].Title){
      document.title=Blogs[0].Title;
    }
      else{
      document.title="No Blogs!!"
    }},[Blogs])
    
    useEffect( ()=>{
      //we need to make a diff function for async as 
      //we are using this in useeffect

      // async function fetchData(){
      //   const querySnapshot = await getDocs(collection(db, "blogs"));
      // querySnapshot.forEach((doc) => {
      //   // doc.data() is never undefined for query doc snapshots
      //   console.log(doc.id, " => ", doc.data());
      //   dispatch({type:"Add", blog:{Title:doc.data().title,Content:doc.data().content}})
      // });
      // }
      // fetchData();
      

      // converting to real time database 
      //used syntax from official fireebase docs
      //onSnapshot is a inbult function in firebase that setsup a real time listener.


      //collection is used to create a reference to a firestore collection
      
      const unsub = onSnapshot(collection(db,"blogs"),(snapShot)=>{
        snapShot.forEach((doc) => {

            console.log(doc.id, " => ", doc.data());
            dispatch({type:"Add", blog:{Title:doc.data().title,Content:doc.data().content}})
          });
      })
    },[]);

    async function handleSubmit(e){
      e.preventDefault();
      document.title=formData.Title
      
      //setBlog([{Title:formData.Title,Content:formData.Content},...Blogs]);
      dispatch({type:"Add", blog:{Title:formData.Title,Content:formData.Content}})
      
      const docRef = doc(collection(db, "blogs"))

       await setDoc(docRef,{
        title: formData.Title,
        content: formData.Content,
        createdOn: new Date()
      });

      setFormData({Title:"",Content:""});
      
      titleRef.current.focus();
      console.log(Blogs);
    }
    function handleRemove(i){
      //setBlog(Blogs.filter((bl,index)=> i!==index));
      dispatch({type:"Remove",index:i})

    }
   return(
    <>
     <h1>Write A Blog!</h1>

     <div className="section">

       <form onSubmit={handleSubmit}>
         
         <Row label="Title">
            <input className="input" 
               value={formData.Title}
               ref={titleRef}
               onChange={(e)=>setFormData({Title: e.target.value,Content: formData.Content})}
               placeholder="Enter the Title of Blog .."/>

         </Row>
          
         <Row label="Content">
            <textarea className="input content" 
                value={formData.Content}
                required
                onChange={(e) => setFormData({Title: formData.Title,Content: e.target.value})}  //if we set only content than it will replace whole with only content 
                placeholder="Enter the Content of Blog .."/>

         </Row>
          
          <button className="btn">Add</button>

       </form>
     
     </div>
      

     <hr/>

      <h2> Blogs </h2> 
       
       {
        Blogs.map((blog,i)=>(
          <div className="blog" key ={i}>
          <h3>{blog.Title}</h3>
          <p> {blog.Content}</p>
          <div className='blog-btn'>
          <button onClick={()=>handleRemove(i)} className="btn remove"> Remove</button>
          </div>
          </div>
        ))
       }

    </>
   )

}

function Row(props){
    const{label} = props;
    return(
        <>
        <label>{label} <br/> </label>
        {props.children}
        <hr/>
        </>
    )
}


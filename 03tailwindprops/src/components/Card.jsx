import React from 'react'

function Card({username = " IMW ", post = "Assigned"}) {
    // console.log(props)
  return (
    <div className="flex flex-col items-center p-7 rounded-2xl">
        <div>
            <img className="size-48 shadow-xl rounded-md" alt="" src="https://plus.unsplash.com/premium_photo-1668024966086-bd66ba04262f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2NlbmVyeXxlbnwwfHwwfHx8MA%3D%3D" />
        </div>
        <div className="flex">
            <span>{username}</span>
            <span>{post}</span>
            <span className="flex">
            <span>No. 4</span>
            <span>·</span>
            <span>2025</span>
            </span>
        </div>
    </div>
  )
}

export default Card

import React from 'react'

function SecondTab({ postResource, setPostResource }) {
  return (
    <div className='mt-10 w-full h-[250px] rounded border'>
      <div className='w-full h-full'>
        <label htmlFor="postResource" className='w-full h-full cursor-pointer'>
          {
            postResource &&
              postResource.type?.split('/')[0] == 'video' ?
              <video src={postResource && URL.createObjectURL(postResource)} controls className='w-full h-full object-contain p-2' /> :
              <img src={postResource ? URL.createObjectURL(postResource) : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVkWDUPopNSujqOBjVZYPOdg8cdZ95P3AYoA&s"} alt="postResource" className='w-full h-full object-contain p-2' />
          }
        </label>
      </div>
      <input accept='image/*, video/*' onChange={(e) => setPostResource(e.target.files[0])} type="file" id='postResource' hidden />
    </div>
  )
}

export default SecondTab
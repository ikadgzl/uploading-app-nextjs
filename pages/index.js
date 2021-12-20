import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

//
//refactor this
//
const postImages = async (formData) => {
  const res = await fetch(
    'https://api.cloudinary.com/v1_1/fatih-uploading/image/upload',
    {
      method: 'POST',
      'Content-Type': 'application/json',
      body: formData
    }
  );

  const data = await res.json();

  console.log('SUCCESS', data);

  // return data;
};
//

export default function Home() {
  const [imagesArray, setImagesArray] = useState([]);
  const [uploadData, setUploadData] = useState([]);
  // const [responseData, setResponseData] = useState(null);

  const onImageChange = (e) => {
    const uploadImageFiles = e.target.files;
    if (uploadImageFiles.length === 0) return;

    const fr = new FileReader();
    const imageName = uploadImageFiles[0].name;

    fr.onload = (onLoadEvent) => {
      if (!imagesArray.find((imagesObj) => imagesObj.name === imageName)) {
        setImagesArray((prevImages) => [
          ...prevImages,
          { name: imageName, src: onLoadEvent.target.result }
        ]);

        setUploadData((prevUploadData) => [
          ...prevUploadData,
          uploadImageFiles[0]
        ]);
      }
    };

    fr.readAsDataURL(e.target.files[0]);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('upload_preset', 'fatih_uploading');

    for (const file of uploadData) {
      formData.append('file', file);
      // const responseData =
      postImages(formData);
      console.log('SENT IMAGE');
      // setResponseData(responseData);
      formData.delete('file');
    }
  };

  // maybe check how many request sent, then if same amount back, navigate or something.
  // useEffect(() => {
  //   console.log('inside this bro');
  //   const timeout = setTimeout(() => {

  //   }, 500);
  //   return () => {
  //     clearTimeout(timeout);
  //   }
  // }, [responseData])

  return (
    <div className={styles.container}>
      <Head>
        <title>Upload Images</title>
        <meta name='description' content='Upload image' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Image Uploader</h1>

        <p className={styles.description}>Upload your images</p>

        <form onSubmit={onFormSubmit} className={styles.form}>
          <label>
            <span>Select your image here:</span>
            <input type='file' name='file' onChange={onImageChange} />
          </label>

          {imagesArray.length !== 0 && (
            <button type='submit' className={styles.btn}>
              Upload Files
            </button>
          )}
        </form>

        <div className={styles.imagesContainer}>
          {imagesArray.length !== 0 &&
            imagesArray.map(({ name, src }) => (
              <div className={styles.images} key={name}>
                <p>{name}</p>
                <Image src={src} width={250} height={250} alt={name} />
              </div>
            ))}
        </div>
      </main>

      <footer className={styles.footer}>All rights reserved.</footer>
    </div>
  );
}

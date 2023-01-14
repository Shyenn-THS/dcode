import { collection, doc, setDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import db from '../utils/firebase';

type Inputs = {
  fname: string;
  lname: string;
  email: string;
  subject: string;
  message: string;
};

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<Inputs>();

  // sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const docRef = doc(collection(db, 'contact'));

    const msg = {
      to: 'shivangmishra0824@gmail.com', // Change to your recipient
      from: '20bit056@ietdavv.edu.in', // Change to your verified sender
      subject: `${data.fname + ' ' + data.lname} | Contacted via SheConfident!`,
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    // sgMail
    //   .send(msg)
    //   .then(() => {
    //     console.log('Email sent');
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    await setDoc(docRef, data)
      .then(() => {
        toast.success('Thank you for contacting us!');
      })
      .catch((err) => {
        toast.error('Sorry some error occured');
      });
  };

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  return (
    <div>
      <section className="bg-mandys-pink-50">
        <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
          <h2 className="mb-4 text-4xl tracking-tight font-bold text-center text-froly-400">
            Contact Us
          </h2>
          <p className="mb-8 lg:mb-16 font-light text-center text-cascade-900 text-xl">
            Got a technical issue? Want to send feedback about a beta feature?
            Need details about Us? Or just want to say hi, Let us know.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <label className="block mb-2 text-sm font-medium text-cascade-800 ">
                First Name<span className="text-froly-400">*</span>
              </label>
              <input
                type="text"
                id="text"
                placeholder="Jhon"
                className="shadow-sm bg-white border border-cascade-200 text-cascade-800 text-sm rounded-lg  block w-full p-2.5 "
                {...register('fname')}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-cascade-800 ">
                Last Name<span className="text-froly-400">*</span>
              </label>
              <input
                type="text"
                id="text"
                placeholder="Doe"
                {...register('lname')}
                className="shadow-sm bg-white border border-cascade-200 text-gray-900 text-sm rounded-lg  block w-full p-2.5 "
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-cascade-800 ">
                Email<span className="text-froly-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="jhondoe@gmail.com"
                {...register('email')}
                className="shadow-sm bg-white border border-cascade-200 text-cascade-800 text-sm rounded-lg  block w-full p-2.5 "
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-cascade-800 ">
                Subject<span className="text-froly-400">*</span>
              </label>
              <input
                type="text"
                id="subject"
                {...register('subject')}
                className="block p-3 w-full text-sm text-cascade-800 bg-white rounded-lg border border-cascade-200 shadow-sm  "
                placeholder="Let us know how we can help you"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-medium text-cascade-800">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                {...register('message')}
                className="block p-2.5 w-full text-sm text-cascade-800 bg-white rounded-lg shadow-sm border border-cascade-200 "
                placeholder="Leave a comment..."
              ></textarea>
            </div>
            <button type="submit" className="buttons">
              Submit
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
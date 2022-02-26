import type { GetServerSideProps } from 'next';
import { useContext } from 'react';
import AuthContext from './../contexts/authContext'
import Head from 'next/head';
import { SkillCard } from '../components/Card';
import "../utils/dbConnection";
import Locale from "../models/localeModel";
import Skills from "../models/skillsModel";
import { FaFacebookF, FaLinkedinIn, FaRegEnvelope } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
const classes = require('./../styles/index.module.css');

const Home = ({ content, skills, locale, stylings, databases, backends, frontends }: any) => {
  const { session }: any = useContext(AuthContext);
  return (
    <div >
      <Head>
        <title>{content.title}</title>
        <meta name={content.title} content={content.content} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${classes.curve} text-white text-2xl`}>
        <br />
        <div className='inline-block'>
          <h1 className="text-2xl">Wachimingo</h1>
          <br />
          <p className="text-base">{content.welcome}</p>
        </div>
        <div className={`${classes.pic}`}>
          <Image
            src='/assets/profile.jpg'
            width={250}
            height={250}
          />
        </div>
      </main>
      <div style={{ marginTop: "-15vh" }}>
        <h2 className="text-2xl">{locale === 'en' ? 'My Skills' : 'Mis habilidades'}</h2>
        <section className="mb-12">
          <h3 className="text-xl">Frontend</h3>
          <br />
          {
            frontends.map((skill: any, i: number) => {
              return (
                <SkillCard skill={skill} />
              )
            })
          }
        </section>
        <section className="mb-12">
          <h3 className="text-xl">Backend</h3>
          <br />
          {
            backends.map((skill: any, i: number) => {
              return (
                <SkillCard skill={skill} />
              )
            })
          }
        </section>
        <section className="mb-12">
          <h3 className="text-xl">{locale === 'en' ? 'Database' : 'Base de datos'}</h3>
          {
            databases.map((skill: any, i: number) => {
              return (
                <SkillCard skill={skill} />
              )
            })
          }
        </section>
        <section className="mb-12">
          <h3 className="text-xl">{locale === 'en' ? 'Styling' : 'Framework CSS'}</h3>
          <br />
          {
            stylings.map((skill: any, i: number) => {
              return (
                <SkillCard skill={skill} />
              )
            })
          }
        </section>
        <section className="mb-4">
          <h1 className="text-xl">{locale === 'en' ? 'Do not forget to check my projects' : 'No te olvides de ver mis proyectos'}</h1>
          <br />
          <Link href={'/projects'} passHref>
            <a className="bg-transparent hover:bg-slate-500 text-slate-700 font-semibold hover:text-white py-2 px-4 border border-slate-500 hover:border-transparent rounded">
              {locale === 'en' ? 'Go to projects' : 'Ir a proyectos'}
            </a>
          </Link>
        </section>
      </div>
      <footer className='bg-slate-800 text-white text-xl'>
        <div className='inline-block mx-2'>
          <h2>{locale === 'en' ? 'Find me in' : 'Encuentrame en'}:</h2>
          <span className='cursor-pointer hover:bg-white hover:text-black pr-1 pl-1 border border-white mr-2'>
            <a href="https://www.facebook.com/halex007/" target="_blank">
              <FaFacebookF className='inline-block' />
            </a>
          </span>
          <span className='cursor-pointer hover:bg-white hover:text-black pr-1 pl-1 border border-white'>
            <a href="https://www.linkedin.com/in/joshua-guillen-755143a7/" target="_blank">
              <FaLinkedinIn className='inline-block' />
            </a>
          </span>
          <br />
          <span className='text-sm'>
            <FaRegEnvelope className='inline-block' /> joshua.herrera2@outlook.com
          </span>
        </div>

      </footer>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const locale = await Locale.find({}).where('locale').equals(context.locale).where('pageName').equals('mainIndex').select('-__v');
    const skills = await Skills.find({}).where('locale').equals(context.locale).select('-__v -locale');
    const databases = skills.filter((skill: any) => {
      return skill.category === 'database'
    });
    const stylings = skills.filter((skill: any) => { return skill.category === 'styling' });
    const backend = skills.filter((skill: any) => { return skill.category === 'backend' });
    const frontend = skills.filter((skill: any) => { return skill.category === 'frontend' });
    return {
      props: {
        content: locale[0].content,
        skills: JSON.parse(JSON.stringify(skills)),
        databases: JSON.parse(JSON.stringify(databases)),
        stylings: JSON.parse(JSON.stringify(stylings)),
        backends: JSON.parse(JSON.stringify(backend)),
        frontends: JSON.parse(JSON.stringify(frontend)),
        locale: context.locale
      }
    }
  } catch (err) {

    return { props: { error: 'Something went wrong' } }
  }
}
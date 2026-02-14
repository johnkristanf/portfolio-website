import Image from 'next/image'

export default function SocialMedia() {
    return (
        <div className="flex justify-center items-center gap-5 mt-10">
            <a
                href="https://www.linkedin.com/in/john-kristan-torremocha-641a42343/"
                target="__blank"
                className="w-8 h-8 rounded-full flex items-center justify-center "
            >
                <Image
                    src={'/img/linkedin-icon.png'}
                    className="rounded-full"
                    width={50}
                    height={50}
                    alt="Linked In Icon"
                />
            </a>
            <a
                href="https://github.com/johnkristanf"
                target="__blank"
                className="w-8 h-8 rounded-full flex items-center justify-center "
            >
                <Image
                    src={'/img/github-icon.jpg'}
                    className=" rounded-full"
                    width={50}
                    height={50}
                    alt="Github Icon"
                />
            </a>

            <a
                href="https://web.facebook.com/johnkristanf"
                target="__blank"
                className="w-8 h-8 rounded-full flex items-center justify-center "
            >
                <Image
                    src={'/img/facebook-icon.png'}
                    className=" rounded-full"
                    width={60}
                    height={60}
                    alt="Facebook Icon"
                />
            </a>

            <a
                href="https://x.com/john_kristan"
                target="__blank"
                className="w-10 h-10 rounded-full flex items-center justify-center "
            >
                <Image
                    src={'/img/twitter-icon.png'}
                    className=" rounded-full"
                    width={70}
                    height={70}
                    alt="Twitter Icon"
                />
            </a>

            <a
                href="https://medium.com/@torremocha.johnkristan_96876"
                target="__blank"
                className="w-10 h-10 rounded-full flex items-center "
            >
                <Image
                    src={'/img/medium.png'}
                    className=" rounded-full"
                    width={30}
                    height={30}
                    alt="Twitter Icon"
                />
            </a>
        </div>
    )
}

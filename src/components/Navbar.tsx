import Image from "next/image";

const Navbar = () => {
    return (
        <div className='w-full h-20 bg-slate-100/60 shadow-md'>
            <nav className='container mx-auto p-3 h-full flex items-center justify-between '>

                <div className='flex items-center justify-center'>
                    <Image src='/images/boardinfinity_logo.png' alt='logo' className='p-2' width={100} height={100}/>
                </div>

                <div className='flex items-center justify-center'>
                    <h1 className='font-bold text-2xl md:text-3xl'>Dashboard</h1>
                </div>
            </nav>
        </div>
    )

}

export default Navbar;
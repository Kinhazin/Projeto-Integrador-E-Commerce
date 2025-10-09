import { Store } from "lucide-react"

function HomePage(){
    return (
        <section style={{backgroundColor: "#EDEFF2"}} className="h-100 w-100">
            <header className="shadow d-flex align-items-center px-2" style={{height: '10%', backgroundColor: '#34495E'}}>
              <Store width={50} color="white" height={50} />  
            </header>
        </section>
    )
}

export default HomePage
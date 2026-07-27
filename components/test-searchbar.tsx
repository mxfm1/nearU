// 'use client'

// import { mockProviders, mockEvents } from './cards/mock-data'
// import type { MockProvider } from './cards/mock-data'
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
// import { } from './ui/badge'
// import { FormEvent, useState } from 'react'

// export default function TestSearchBar() {

//     const [temporalStore, setTemporalStore] = useState<MockProvider[]>(mockProviders)

//     const handleSubmit = (e) => {

//         const value = e.target.value
//         console.log("INITIAL STORE", temporalStore)

//         if (value == "") return;

//         setTemporalStore(() => temporalStore.filter((provider) =>
//             provider.name.toLowerCase().includes(value.toLowerCase())
//         ))
//     }

//     const onChnage = (e) => {
//         const value = e.target.value

//         if (value == "") return;
//         setTemporalStore(() => temporalStore.filter((provider) =>
//             provider.name.toLowerCase().includes(value.toLowerCase())
//         ))
//     }

//     return (
//         <div className='h-72 w-full bg-background eounded-md shadow-md'>
//             <div className='flex items-center justify-center'>
//                 <form
//                     action=""
//                     className='h-52 w-full bg-background shadow-md'
//                     onSubmit={handleSubmit}
//                     onChange={onChnage}
//                 >
//                     <input type="text" />

//                     <button>
//                         buscar
//                     </button>
//                 </form>
//             </div>

//             {temporalStore.map((provider) => (
//                 <Card key={provider.name}>
//                     <CardHeader>
//                         <CardTitle>{provider.name}</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <p>{provider.category}</p>
//                         <p>{provider.location}</p>
//                     </CardContent>
//                 </Card>
//             ))}
//         </div>
//     )
// }

import React, { useState, useEffect } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import IconArrowDown from '../../assets/icon-arrow-down.svg?react'
import IconCheck from '../../assets/icon-check.svg?react'
import { useDispatch, useSelector } from 'react-redux'
import { setStatusFilter } from '../../store'
import { useLocation, useNavigate } from 'react-router-dom'

function FilterItem() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const activeStatus = useSelector((state) => state.invoices.statusFilter)
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const status = location.pathname.split('/')[2];

    useEffect(() => {
        if (status) {
            dispatch(setStatusFilter(status));
        }

        if(!status) {
            dispatch(setStatusFilter(null))
            setIsFilterOpen(false)

        }
    }, [status, dispatch])

    const handleToggleFilterAction = function () {
        setIsFilterOpen(!isFilterOpen)
    }

    const handleFilterAction = function (status) {
        dispatch(setStatusFilter(status))
        setIsFilterOpen(false)
        navigate(`/status/${status}`)
    }

    const variants = {
        open: {
            opacity: 1,
            y: 8,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 25
            }
        },
        closed: {
            opacity: 0,
            y: -10,
            transition: {
                duration: 0.15
            }
        }
    }

  return (
    <div className='relative'>
        <button className="flex items-center gap-2 sm:gap-3.5 cursor-pointer" onClick={handleToggleFilterAction}>
        <p className='font-bold sm:hidden dark:text-white'>Filter</p>
        <p className='font-bold hidden sm:block dark:text-white'>Filter by status</p>
        <div className={`text-pri-100 ${isFilterOpen ? 'rotate-180' : ''}`}>
            <IconArrowDown />
        </div>
    </button>

    <AnimatePresence>
        {isFilterOpen && (
            <Motion.div
                key="dropdown"
                variants={variants}
                initial="closed"
                animate="open"
                exit="closed"
                className="absolute -left-16 sm:-left-12 top-8 bg-white dark:bg-pri-400 p-6 w-56 rounded-lg shadow-lg flex flex-col gap-4 z-50">
                {['draft', 'pending', 'paid'].map((item) => (
                    <li key={item} className='list-none' onClick={() => handleFilterAction(item)}> 
                        <button className='cursor-pointer flex items-center gap-3.5 group w-full text-left'>
                            <div className={`w-4 h-4 rounded-sm border-2 border-pri-100 flex items-center justify-center ${item === activeStatus ? 'bg-pri-100' : 'dark:bg-pri-300'}`}>
                                {item === activeStatus && <IconCheck className="text-white" />}
                            </div>
                            <p className='font-bold capitalize dark:text-white'>{item}</p>
                        </button>
                    </li>
                ))}
            </Motion.div>
        )}
    </AnimatePresence>
    </div>
  )
}

export default FilterItem
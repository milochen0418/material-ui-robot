import React, {useState, useRef, useEffect} from 'react'
import moment from 'moment'
import styled from 'styled-components'
import {LogMessage} from 'types'
import {maxLogsEntries} from 'config'
import {LogsControlProps} from './types'

const LogsWrapper = styled.div`
    padding: 12px 15px;
    background-color: #1a1d21;
    color: white;
    height: 100%;
    overflow-y: auto;
    font-family: monospace;
`

const LogsEntry = styled.div`
    margin: 5px 0;
`

const LogsControl = ({initLogListener, robotId}: LogsControlProps) => {
    const [logs, setLogs] = useState([] as LogMessage[])
    const [scrollAtBottom, setScrollAtBottom] = useState(true)
    const wrapper = useRef<HTMLDivElement>(null)
    const bottomElement = useRef<HTMLDivElement>(null)

    const setNextLogs = (newLogs: LogMessage[]) => {
        setLogs(currentLogs => {
            const nextLogs = [...currentLogs, ...newLogs]
            return nextLogs.length > maxLogsEntries ?
                nextLogs.slice(nextLogs.length - maxLogsEntries, maxLogsEntries) :
                nextLogs
        })
    }

    const onScroll = () => {
        if (!wrapper.current) {
            return
        }

        const {scrollTop, scrollHeight, clientHeight} = wrapper.current
        const scrollBottom = scrollHeight - clientHeight
        setScrollAtBottom(scrollBottom <= 0 || scrollTop === scrollBottom)
    }

    useEffect(() => {
        setLogs([])
        const eventSource = initLogListener(robotId, (newMessage) => {
            setNextLogs(Array.isArray(newMessage) ? newMessage : [newMessage])
        })

        return () => {
            eventSource.close()
        }
    }, [robotId])

    useEffect(() => {
        if (scrollAtBottom && bottomElement.current !== null) {
            bottomElement.current.scrollIntoView({behavior: 'smooth'})
        }
    }, [logs, scrollAtBottom])

    return (
        <LogsWrapper ref={wrapper} onScroll={onScroll}>
            {logs.map(log => (
                <LogsEntry key={log.date.getTime()}>
                    [{moment(log.date).format('DD-MM-YYYY HH:mm:ss.SSS')}] {log.message}
                </LogsEntry>
            ))}
            <div ref={bottomElement} />
        </LogsWrapper>
    )
}

export default LogsControl

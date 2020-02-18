import {Title} from 'components'
import React from 'react'
import {useTranslation} from 'react-i18next'

const PageNotFound = () => {
    const {t} = useTranslation()
    return (
        <Title>
            {t('page not found')}
        </Title>
    )
}

export default PageNotFound

import type React from 'react'
import * as S from './styled'
export interface Tab {
    id: string
    label: string
    count?: number
}
interface TabProp {
    tabs: Tab[]
    activeId: string
    onTabChange: (id: string) => void
}
export const Tabs: React.FC<TabProp> = ({ tabs, activeId, onTabChange }) => {
    return (
        <S.TabContainer>
            {tabs.map((tab) => (
                <S.TabButton key={tab.id} $isActive={activeId === tab.id} onClick={() => onTabChange(tab.id)}>
                    {tab.label}
                    {tab.count !== undefined && <S.TabBadge>{tab.count}</S.TabBadge>}
                </S.TabButton>
            ))}
        </S.TabContainer>
    )
}
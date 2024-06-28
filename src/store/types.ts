export interface Store {
    id?: string | number
    activeNavTab: 'inventory' | 'tasks' | 'main' | 'friends' | 'roadmap'
    balance: number | null
    energy: number | null
    time: number | null
    current_time: number | null
    infoData: InfoData
    tasksPage: TasksData
    shopPage: InventoryPage
    inventoryPage: InventoryPage
    task: TaskData
    friendsPage: FriendsData
    loadingInventoryPage: string
    loadingInventoryPageError: string | null
    loadingShopPage: string
    loadingShopPageError: string | null
    loadingFriendsPage: string
    loadingInfoData: string
    loadingTapRes: string
    loadingInfoError: string | null
    loadingTapResError: string | null
    loadingFriendsPageError: string | null
    buyError: string | null
    equipStatus: string | null
    totalPages: number | null
    checkTaskError: string | null
}

export interface InventoryPage {
    page?: number
    total_pages?: number
    content?: InventoryContent[]
}

export interface InventoryContent {
    isEquipped: boolean
    name?: string
    cloth_id: number
    img?: string
    desc?: string
    currency?: CurrencyContent[]
}

export interface CurrencyContent {
    currency?: number
    price?: number
}

export interface InfoData {
    balance?: number
    nick?: string
    damage?: number
    energy?: number
    time: number
    current_time: number
    equipped?: string[]
}

export interface TaskData { 
    id?: number
    description?: string
    ref_url?: string
    image?: string
    stats?: string
}

export interface TasksData {
    tasks?: TasksArray
    text?: string
}

export interface TasksArray {
    page?: number
    total_pages?: number
    content?: ContentTasks[]
}

export interface ContentTasks {
    name?: string
    id?: number
    status?: 'open' | 'done' | 'check' | 'not_done'
    ref_url?: string
    points?: string
    img?: string;
}

export interface FriendsData {
    friends?: FriendsArray
    url: string
    total_friends?: number
}

export interface FriendsArray {
    page?: number
    total_pages?: number
    content?: ContentFriends[]
}

export interface ContentFriends {
    nickname: string
    profit: string
}
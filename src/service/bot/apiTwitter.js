const {client} = require("../../.config/twit");
const { DateUtil } = require("../../utils/date");
const fileManager = require("../../utils/fileManager");

class ApiTwitter{

    // Информация о себе
    async me(){
        return (await client.v2.me()).data
    }

    // Подписаться на канал по Id
    async follow(loggedUserId, targetUserId){
        return (await client.v2.follow(loggedUserId, targetUserId)).data;
    }

    // Отписаться от канала по Id
    async unfollow(loggedUserId, targetUserId){
        return (await client.v2.unfollow(loggedUserId, targetUserId)).data;
    }

    // Получите пользователей, по массиву имен пользователей.
    async usersByUsernames(usernames){
        return await client.v2.usersByUsernames(usernames).data
    }

    // Получите пользователей, по массиву идентификаторов.
    async usersByIds(userIds){
        return (await client.v2.users(userIds)).data
    }
    
    // Получите подписчиков (людей, которые подписаны) с определенным идентификатором пользователя.
    async followings(userId){ 
         return (await client.v2.following(userId, { 
            asPaginator: true 
        })).data
    }
    
    // Получение N твиттов по id аккаунта
    async tweetsN(userId, max = 10){
        let {data, meta, includes} = (await client.v2.userTimeline(userId, { 
            "tweet.fields": "created_at,author_id,id,text,attachments",
            "expansions": "attachments.media_keys",
            "media.fields": "variants,alt_text,duration_ms,url,preview_image_url",
            "max_results": max,
            exclude: 'replies'
        })).data

        let result_count = meta.result_count
        if(!result_count){
            return { data: [], result_count}
        }
        while(max !== result_count){
            const next = (await client.v2.userTimeline(userId, { 
                "tweet.fields": "created_at,author_id,id,text,attachments",
                "expansions": "attachments.media_keys",
                "media.fields": "variants,alt_text,duration_ms,url,preview_image_url",
                "pagination_token": meta.next_token,
                exclude: 'replies'
            })).data

            if(next.meta.result_count == 0)
                break
            data = data.concat(next.data)
            if(next.includes)
                includes.media = includes.media.concat(next.includes.media)
            meta = next.meta
            result_count += next.meta.result_count
        }
        
        return {data, includes, result_count}
    }

    // Получение твиттов за указанный период времени по id аккаунта
    async tweetsT(userId, start = DateUtil.Date(-1) , end = DateUtil.Date()){
        if(!(start instanceof Date))
            start = DateUtil.StrToDate(start)
        if(!(end instanceof Date))
            end = DateUtil.StrToDate(end)

        let {data, meta, includes} = (await client.v2.userTimeline(userId, { 
            "tweet.fields": "created_at,author_id,id,text,attachments",
            "expansions": "attachments.media_keys",
            "media.fields": "variants,alt_text,duration_ms,url,preview_image_url",
            "max_results": 100,
            "start_time": start.toISOString(),
            "end_time": end.toISOString(),
            exclude: 'replies'
        })).data
        
        let result_count = meta.result_count
        if(!result_count){
            return { data: [], result_count}
        }

        while(meta.next_token){
            const next = (await client.v2.userTimeline(userId, { 
                "tweet.fields": "created_at,author_id,id,text,attachments",
                "expansions": "attachments.media_keys",
                "media.fields": "variants,alt_text,duration_ms,url,preview_image_url",
                "start_time": start.toISOString(),
                "end_time": end.toISOString(),
                "max_results": 100,
                "pagination_token": meta.next_token,
                exclude: 'replies'
            })).data

            if(next.meta.result_count == 0)
                break
            data = data.concat(next.data)
            if(next.includes)
                includes.media = includes.media.concat(next.includes.media)
            meta = next.meta
            result_count += next.meta.result_count
        }
        return {data, includes, result_count}
    }

    // Получение твиттов из ленты подписанных
    async reverse_chronological(start = DateUtil.Date(-1) , end = DateUtil.Date()) {
        let {data, meta, includes} = (await client.v2.homeTimeline({ 
            "tweet.fields": "created_at,author_id,id,text,attachments",
            "expansions": "attachments.media_keys",
            "media.fields": "variants,alt_text,duration_ms,url,preview_image_url",
            "start_time": start, // Время предыдущей остановки
            "end_time": end, // Текущее время
            "max_results": 100,
            exclude: 'replies'
        })).data
        
        let result_count = meta.result_count
        if(!result_count){
            return { data: [], result_count}
        }
        while(meta.next_token){
            const next = (await client.v2.homeTimeline({ 
                "tweet.fields": "created_at,author_id,id,text,attachments",
                "expansions": "attachments.media_keys",
                "media.fields": "variants,alt_text,duration_ms,url,preview_image_url",
                "start_time": start,
                "end_time": end,
                "max_results": 100,
                "pagination_token": meta.next_token,
                exclude: 'replies'
            })).data

            if(next.meta.result_count == 0)
                break
            data = data.concat(next.data)
            if(next.includes)
                includes.media = includes.media.concat(next.includes.media)
            meta = next.meta
            result_count += next.meta.result_count
        }
       
        return {data, includes, result_count}
    }
}

module.exports = ApiTwitter
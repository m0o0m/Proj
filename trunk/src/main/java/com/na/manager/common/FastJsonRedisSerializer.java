package com.na.manager.common;

import java.nio.charset.Charset;

import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.SerializationException;

import com.alibaba.fastjson.JSONObject;

public class FastJsonRedisSerializer<T> implements RedisSerializer<T> {
	

	public static final Charset DEFAULT_CHARSET = Charset.forName("UTF-8");

    private Class<T> clazz;

    public FastJsonRedisSerializer(Class<T> clazz) {
        super();
        this.clazz = clazz;
    }

    public byte[] serialize(T t) throws SerializationException {
        if (t == null) {
            return new byte[0];
        }
//        return JSONObject.toJSONString(t,SerializerFeature.WriteClassName).getBytes(DEFAULT_CHARSET);
        return JSONObject.toJSONString(t).getBytes(DEFAULT_CHARSET);
    }

    public T deserialize(byte[] bytes) throws SerializationException {
        if (bytes == null || bytes.length <= 0) {
            return null;
        }
        String str = new String(bytes, DEFAULT_CHARSET);
        
        return (T) JSONObject.parseObject(str, clazz);
    }

}

-- ====================================
-- 等待内容数据库完整SQL脚本
-- 用于生图等待期间的内容展示系统
-- 数据表结构 (8张主表)
--   - waiting_contents - 等待内容主表
--   - styling_tips - 穿搭小技巧详细表
--   - fashion_trends - 潮流趋势详细表
--   - user_showcases - 用户作品展示表
--   - content_tags - 内容标签表
--   - user_content_preferences - 用户偏好表
--   - content_display_logs - 展示记录表
--   - content_metadata - 内容元数据表
-- ====================================

-- 1. 创建枚举类型
CREATE TYPE waiting_content_type AS ENUM (
    'styling_tip',      -- 穿搭小技巧
    'trend_fashion',    -- 最新潮流
    'user_showcase'     -- 用户作品展示
);

CREATE TYPE interaction_type AS ENUM (
    'view',            -- 浏览
    'like',            -- 点赞
    'skip',            -- 跳过
    'share'            -- 分享
);

-- 2. 主要数据表

-- 等待内容主表
CREATE TABLE waiting_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,           -- 内容标题
    description TEXT,                      -- 描述/穿搭小技巧
    image_url VARCHAR(500) NOT NULL,       -- 图片URL
    content_type waiting_content_type NOT NULL, -- 内容类型
    display_order INTEGER DEFAULT 0,       -- 显示顺序
    is_active BOOLEAN DEFAULT true,        -- 是否启用
    view_count INTEGER DEFAULT 0,          -- 浏览次数
    like_count INTEGER DEFAULT 0,          -- 点赞数
    share_count INTEGER DEFAULT 0,         -- 分享次数
    quality_score INTEGER DEFAULT 50,      -- 质量评分 (0-100)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 穿搭小技巧详细表
CREATE TABLE styling_tips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    waiting_content_id UUID REFERENCES waiting_contents(id) ON DELETE CASCADE,
    tip_category VARCHAR(50),              -- 小技巧分类
    tip_content TEXT NOT NULL,             -- 具体技巧内容
    applicable_seasons TEXT[],             -- 适用季节
    applicable_occasions TEXT[],           -- 适用场合
    body_types TEXT[],                     -- 适用体型
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 5), -- 难度等级
    color_keywords TEXT[],                 -- 颜色关键词
    style_keywords TEXT[],                 -- 风格关键词
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 潮流趋势详细表
CREATE TABLE fashion_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    waiting_content_id UUID REFERENCES waiting_contents(id) ON DELETE CASCADE,
    trend_name VARCHAR(100) NOT NULL,      -- 趋势名称
    trend_season VARCHAR(20),              -- 流行季节
    trend_year INTEGER,                    -- 流行年份
    color_palette TEXT[],                  -- 主要色彩
    style_tags TEXT[],                     -- 风格标签
    popularity_score INTEGER DEFAULT 50 CHECK (popularity_score >= 0 AND popularity_score <= 100), -- 流行度评分
    trend_description TEXT,                -- 趋势描述
    brand_examples TEXT[],                 -- 品牌案例
    celebrity_examples TEXT[],             -- 明星案例
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户作品展示详细表
CREATE TABLE user_showcases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    waiting_content_id UUID REFERENCES waiting_contents(id) ON DELETE CASCADE,
    original_look_id UUID,                 -- 原始Look ID
    user_id UUID,                         -- 用户ID（可匿名化）
    generation_prompt TEXT,                -- 生成提示词
    style_category VARCHAR(50),            -- 风格分类
    color_scheme TEXT[],                   -- 配色方案
    garment_types TEXT[],                  -- 服装类型
    is_featured BOOLEAN DEFAULT false,     -- 是否精选
    feature_reason TEXT,                   -- 精选理由
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5), -- 用户评分
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 内容标签表
CREATE TABLE content_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,      -- 标签名称
    category VARCHAR(30),                  -- 标签分类
    color VARCHAR(7),                      -- 标签颜色
    usage_count INTEGER DEFAULT 0,         -- 使用次数
    is_active BOOLEAN DEFAULT true,        -- 是否启用
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 内容标签关联表
CREATE TABLE waiting_content_tags (
    waiting_content_id UUID REFERENCES waiting_contents(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES content_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (waiting_content_id, tag_id)
);

-- 用户个性化偏好表
CREATE TABLE user_content_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    preferred_styles TEXT[],               -- 偏好风格
    preferred_colors TEXT[],               -- 偏好颜色
    preferred_seasons TEXT[],              -- 偏好季节
    preferred_occasions TEXT[],            -- 偏好场合
    disliked_tags TEXT[],                 -- 不喜欢的标签
    preferred_content_types waiting_content_type[], -- 偏好内容类型
    interaction_history JSONB DEFAULT '{}', -- 交互历史
    last_interaction_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 内容展示记录表
CREATE TABLE content_display_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    waiting_content_id UUID REFERENCES waiting_contents(id) ON DELETE CASCADE,
    session_id VARCHAR(100),               -- 生成会话ID
    display_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    interaction_type interaction_type,     -- 交互类型
    display_duration INTEGER,              -- 展示时长（秒）
    device_info JSONB,                     -- 设备信息
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 内容管理元数据表
CREATE TABLE content_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    waiting_content_id UUID REFERENCES waiting_contents(id) ON DELETE CASCADE,
    source_type VARCHAR(50),               -- 内容来源类型
    source_url VARCHAR(500),               -- 原始来源URL
    author_name VARCHAR(100),              -- 作者名称
    copyright_info TEXT,                   -- 版权信息
    review_status VARCHAR(20) DEFAULT 'pending', -- 审核状态
    reviewer_id UUID,                      -- 审核员ID
    review_notes TEXT,                     -- 审核备注
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 索引创建
CREATE INDEX idx_waiting_contents_type_active ON waiting_contents(content_type, is_active);
CREATE INDEX idx_waiting_contents_order ON waiting_contents(display_order);
CREATE INDEX idx_waiting_contents_quality ON waiting_contents(quality_score DESC);
CREATE INDEX idx_styling_tips_category ON styling_tips(tip_category);
CREATE INDEX idx_fashion_trends_season_year ON fashion_trends(trend_season, trend_year);
CREATE INDEX idx_user_showcases_featured ON user_showcases(is_featured);
CREATE INDEX idx_content_tags_category ON content_tags(category);
CREATE INDEX idx_content_display_logs_user_time ON content_display_logs(user_id, display_time);
CREATE INDEX idx_content_display_logs_session ON content_display_logs(session_id);
CREATE INDEX idx_user_content_preferences_user ON user_content_preferences(user_id);
CREATE INDEX idx_content_metadata_review_status ON content_metadata(review_status);

-- 4. 触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器
CREATE TRIGGER update_waiting_contents_updated_at 
    BEFORE UPDATE ON waiting_contents 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_content_preferences_updated_at 
    BEFORE UPDATE ON user_content_preferences 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_content_metadata_updated_at 
    BEFORE UPDATE ON content_metadata 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 5. 核心业务函数

-- 获取个性化等待内容
CREATE OR REPLACE FUNCTION get_personalized_waiting_content(
    p_user_id UUID,
    p_session_id VARCHAR(100),
    p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
    content_id UUID,
    title VARCHAR,
    description TEXT,
    image_url VARCHAR,
    content_type waiting_content_type,
    display_order INTEGER,
    relevance_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        wc.id,
        wc.title,
        wc.description,
        wc.image_url,
        wc.content_type,
        wc.display_order,
        (
            -- 基础分数
            50 +
            -- 用户偏好匹配分数
            CASE WHEN EXISTS (
                SELECT 1 FROM user_content_preferences ucp 
                WHERE ucp.user_id = p_user_id 
                AND (
                    wc.content_type = ANY(ucp.preferred_content_types) OR
                    ucp.preferred_content_types IS NULL
                )
            ) THEN 20 ELSE 0 END +
            -- 质量分数权重
            (wc.quality_score::float / 100 * 20)::integer +
            -- 流行度分数
            (wc.like_count::float / GREATEST(wc.view_count, 1) * 10)::integer
        ) as relevance_score
    FROM waiting_contents wc
    WHERE wc.is_active = true
    AND NOT EXISTS (
        -- 避免重复展示（最近2小时内）
        SELECT 1 FROM content_display_logs cdl 
        WHERE cdl.user_id = p_user_id 
        AND cdl.waiting_content_id = wc.id 
        AND cdl.display_time > NOW() - INTERVAL '2 hours'
    )
    ORDER BY relevance_score DESC, wc.display_order, RANDOM()
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- 记录内容展示
CREATE OR REPLACE FUNCTION log_content_display(
    p_user_id UUID,
    p_waiting_content_id UUID,
    p_session_id VARCHAR(100),
    p_interaction_type interaction_type DEFAULT 'view',
    p_display_duration INTEGER DEFAULT NULL,
    p_device_info JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO content_display_logs (
        user_id, 
        waiting_content_id, 
        session_id, 
        interaction_type, 
        display_duration, 
        device_info
    ) VALUES (
        p_user_id, 
        p_waiting_content_id, 
        p_session_id, 
        p_interaction_type, 
        p_display_duration, 
        p_device_info
    ) RETURNING id INTO log_id;
    
    -- 更新内容统计
    IF p_interaction_type = 'view' THEN
        UPDATE waiting_contents 
        SET view_count = view_count + 1 
        WHERE id = p_waiting_content_id;
    ELSIF p_interaction_type = 'like' THEN
        UPDATE waiting_contents 
        SET like_count = like_count + 1 
        WHERE id = p_waiting_content_id;
    ELSIF p_interaction_type = 'share' THEN
        UPDATE waiting_contents 
        SET share_count = share_count + 1 
        WHERE id = p_waiting_content_id;
    END IF;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- 更新用户偏好
CREATE OR REPLACE FUNCTION update_user_preferences(
    p_user_id UUID,
    p_interaction_type interaction_type,
    p_content_id UUID
) RETURNS VOID AS $$
DECLARE
    content_rec RECORD;
BEGIN
    -- 获取内容信息
    SELECT wc.content_type, st.style_keywords, st.color_keywords, ft.style_tags, ft.color_palette
    INTO content_rec
    FROM waiting_contents wc
    LEFT JOIN styling_tips st ON wc.id = st.waiting_content_id
    LEFT JOIN fashion_trends ft ON wc.id = ft.waiting_content_id
    WHERE wc.id = p_content_id;
    
    -- 创建或更新用户偏好
    INSERT INTO user_content_preferences (user_id, preferred_content_types, last_interaction_at)
    VALUES (p_user_id, ARRAY[content_rec.content_type], NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        preferred_content_types = CASE 
            WHEN p_interaction_type = 'like' THEN 
                array_append(
                    COALESCE(user_content_preferences.preferred_content_types, ARRAY[]::waiting_content_type[]), 
                    content_rec.content_type
                )
            ELSE user_content_preferences.preferred_content_types
        END,
        last_interaction_at = NOW(),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 6. 初始化数据

-- 插入内容标签
INSERT INTO content_tags (name, category, color) VALUES
('简约', 'style', '#2196F3'),
('优雅', 'style', '#9C27B0'),
('休闲', 'style', '#4CAF50'),
('商务', 'style', '#FF9800'),
('街头', 'style', '#F44336'),
('复古', 'style', '#795548'),
('红色', 'color', '#F44336'),
('蓝色', 'color', '#2196F3'),
('绿色', 'color', '#4CAF50'),
('黄色', 'color', '#FFEB3B'),
('紫色', 'color', '#9C27B0'),
('黑色', 'color', '#000000'),
('白色', 'color', '#FFFFFF'),
('春季', 'season', '#8BC34A'),
('夏季', 'season', '#FF9800'),
('秋季', 'season', '#FF5722'),
('冬季', 'season', '#607D8B'),
('约会', 'occasion', '#E91E63'),
('工作', 'occasion', '#3F51B5'),
('聚会', 'occasion', '#FF4081'),
('旅行', 'occasion', '#00BCD4');

-- 插入等待内容 - 穿搭小技巧
INSERT INTO waiting_contents (title, description, image_url, content_type, display_order, quality_score) VALUES
('色彩搭配黄金法则', '掌握60-30-10配色原则，轻松打造层次丰富的高级穿搭', 'https://example.com/color-rule.jpg', 'styling_tip', 1, 85),
('身材比例优化秘诀', '利用高腰线设计拉长腿部比例，显高显瘦一步到位', 'https://example.com/proportion.jpg', 'styling_tip', 2, 90),
('配饰点睛之笔', '一条丝巾的N种系法，瞬间提升整体造型格调', 'https://example.com/accessories.jpg', 'styling_tip', 3, 80),
('层次叠穿艺术', '冬日温暖与时尚并存的叠穿技巧分享', 'https://example.com/layering.jpg', 'styling_tip', 4, 88);

-- 插入等待内容 - 潮流趋势
INSERT INTO waiting_contents (title, description, image_url, content_type, display_order, quality_score) VALUES
('2024春夏流行色趋势', '活力橙与宁静蓝的完美碰撞，引领新季时尚风向', 'https://example.com/trend-2024.jpg', 'trend_fashion', 5, 92),
('极简主义回归', '少即是多的现代穿搭理念，追求极致的简约美学', 'https://example.com/minimalism.jpg', 'trend_fashion', 6, 85),
('Y2K复古风潮', '千禧年美学强势回归，金属质感与未来感并存', 'https://example.com/y2k-trend.jpg', 'trend_fashion', 7, 78);

-- 插入等待内容 - 用户作品展示
INSERT INTO waiting_contents (title, description, image_url, content_type, display_order, quality_score) VALUES
('优雅法式穿搭', '用户@时尚达人的法式优雅演绎，简约中透露精致', 'https://example.com/user-french.jpg', 'user_showcase', 8, 87),
('街头潮流混搭', '来自@潮流玩家的创意搭配，个性十足的街头风格', 'https://example.com/user-street.jpg', 'user_showcase', 9, 83),
('职场干练造型', '用户@白领丽人展示的职场穿搭，专业感十足', 'https://example.com/user-office.jpg', 'user_showcase', 10, 89);

-- 插入详细信息 - 穿搭小技巧
INSERT INTO styling_tips (waiting_content_id, tip_category, tip_content, applicable_seasons, applicable_occasions, difficulty_level, color_keywords, style_keywords) 
SELECT 
    wc.id, 
    '色彩搭配', 
    '60%主色调+30%辅助色+10%点缀色，这个黄金比例让你的穿搭更有层次感', 
    ARRAY['春季', '夏季', '秋季', '冬季'], 
    ARRAY['日常', '工作', '约会'], 
    2,
    ARRAY['主色调', '辅助色', '点缀色'],
    ARRAY['层次感', '协调', '平衡']
FROM waiting_contents wc WHERE wc.title = '色彩搭配黄金法则';

INSERT INTO styling_tips (waiting_content_id, tip_category, tip_content, applicable_seasons, applicable_occasions, difficulty_level, color_keywords, style_keywords)
SELECT 
    wc.id, 
    '身材修饰', 
    '高腰设计可以提升腰线位置，在视觉上拉长下半身比例，让你看起来更高更瘦', 
    ARRAY['春季', '夏季', '秋季', '冬季'], 
    ARRAY['日常', '约会', '聚会'], 
    1,
    ARRAY['黑色', '深色', '浅色'],
    ARRAY['高腰', '显瘦', '比例']
FROM waiting_contents wc WHERE wc.title = '身材比例优化秘诀';

-- 插入详细信息 - 潮流趋势  
INSERT INTO fashion_trends (waiting_content_id, trend_name, trend_season, trend_year, color_palette, style_tags, popularity_score, trend_description)
SELECT 
    wc.id,
    '2024春夏色彩趋势',
    '春夏',
    2024,
    ARRAY['活力橙', '宁静蓝', '薄荷绿', '珊瑚粉'],
    ARRAY['清新', '活力', '年轻'],
    95,
    '本季最受关注的色彩组合，既有温暖的橙色带来的活力，又有冷静蓝色的平衡'
FROM waiting_contents wc WHERE wc.title = '2024春夏流行色趋势';

-- 插入详细信息 - 用户作品
INSERT INTO user_showcases (waiting_content_id, style_category, color_scheme, garment_types, is_featured, feature_reason, user_rating)
SELECT 
    wc.id,
    '法式优雅',
    ARRAY['米白', '焦糖', '海军蓝'],
    ARRAY['风衣', '高领毛衣', '直筒裤'],
    true,
    '色彩搭配和谐统一，展现了法式穿搭的精髓',
    5
FROM waiting_contents wc WHERE wc.title = '优雅法式穿搭';

-- 插入内容标签关联
INSERT INTO waiting_content_tags (waiting_content_id, tag_id)
SELECT wc.id, ct.id
FROM waiting_contents wc, content_tags ct
WHERE (wc.title = '色彩搭配黄金法则' AND ct.name IN ('简约', '日常'))
   OR (wc.title = '身材比例优化秘诀' AND ct.name IN ('显瘦', '实用'))
   OR (wc.title = '2024春夏流行色趋势' AND ct.name IN ('春季', '夏季', '流行'))
   OR (wc.title = '优雅法式穿搭' AND ct.name IN ('优雅', '法式', '经典'));

-- 7. 权限设置 (根据需要调整)
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO your_app_user;

-- 8. 数据清理函数（可选）
CREATE OR REPLACE FUNCTION cleanup_old_display_logs(days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM content_display_logs 
    WHERE display_time < NOW() - INTERVAL '1 day' * days_to_keep;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 创建定期清理任务（需要pg_cron扩展，可选）
-- SELECT cron.schedule('cleanup-display-logs', '0 2 * * *', 'SELECT cleanup_old_display_logs(30);');

COMMENT ON TABLE waiting_contents IS '等待内容主表，存储所有展示给用户的内容';
COMMENT ON TABLE styling_tips IS '穿搭小技巧详细信息表';
COMMENT ON TABLE fashion_trends IS '潮流趋势详细信息表';
COMMENT ON TABLE user_showcases IS '用户作品展示详细信息表';
COMMENT ON TABLE content_tags IS '内容标签表';
COMMENT ON TABLE user_content_preferences IS '用户个性化偏好表';
COMMENT ON TABLE content_display_logs IS '内容展示记录表，用于统计和个性化推荐';
COMMENT ON FUNCTION get_personalized_waiting_content IS '获取个性化等待内容推荐';
COMMENT ON FUNCTION log_content_display IS '记录内容展示日志';
COMMENT ON FUNCTION update_user_preferences IS '更新用户偏好设置';
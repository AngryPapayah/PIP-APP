import React, {useState, useEffect, useRef} from 'react';
import {Text, ScrollView} from 'react-native';

const Typewriter = ({text, speed = 80, style, onAnimationComplete}) => {
    const [displayText, setDisplayText] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        let i = 0;
        // reset text when it changes
        setDisplayText('');

        const typing = setInterval(() => {
            if (i < text.length) {
                setDisplayText(text.substring(0, i + 1));
                i++;
            } else {
                clearInterval(typing);
                // Call the callback when the animation finishes
                if (onAnimationComplete) {
                    onAnimationComplete();
                }
            }
        }, speed);

        return () => clearInterval(typing);
    }, [text, speed, onAnimationComplete]);

    return (
        <ScrollView
            ref={scrollRef}
            // keep the newest typed line in view while typing
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({animated: false})}
            showsVerticalScrollIndicator={false}
        >
            <Text style={style}>{displayText}</Text>
        </ScrollView>
    );
};

export default Typewriter;
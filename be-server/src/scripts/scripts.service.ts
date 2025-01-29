import { Injectable } from '@nestjs/common';

@Injectable()
export class ScriptsService {
    private readonly items = [
        {
            name: "Magic 1",
            description: "In a world where technology and nature coexist, the harmony between innovation and the environment is crucial. Sustainable practices and green technologies pave the way for a brighter future, ensuring that progress does not come at the expense of our planet. Together, we can build a sustainable and prosperous world for generations to come.",
            privacy: "public",
        },
        {
            name: "Magic 2",
            description: "This is a simple item 2",
            privacy: "public",
        },
        {
            name: "Magic 3",
            description: "This is a simple item 3",
            privacy: "private",
        },
        {
            name: "Magic 1",
            description: "In a world where technology and nature coexist, the harmony between innovation and the environment is crucial. Sustainable practices and green technologies pave the way for a brighter future, ensuring that progress does not come at the expense of our planet. Together, we can build a sustainable and prosperous world for generations to come.",
            privacy: "public",
        },
        {
            name: "Magic 2",
            description: "This is a simple item 2",
            privacy: "public",
        },
        {
            name: "Magic 3",
            description: "This is a simple item 3",
            privacy: "private",
        },
        {
            name: "Magic 1",
            description: "In a world where technology and nature coexist, the harmony between innovation and the environment is crucial. Sustainable practices and green technologies pave the way for a brighter future, ensuring that progress does not come at the expense of our planet. Together, we can build a sustainable and prosperous world for generations to come.",
            privacy: "public",
        },
        {
            name: "Magic 2",
            description: "This is a simple item 2",
            privacy: "public",
        },
        {
            name: "Magic 3",
            description: "This is a simple item 3",
            privacy: "private",
        },
        {
            name: "Magic 1",
            description: "In a world where technology and nature coexist, the harmony between innovation and the environment is crucial. Sustainable practices and green technologies pave the way for a brighter future, ensuring that progress does not come at the expense of our planet. Together, we can build a sustainable and prosperous world for generations to come.",
            privacy: "public",
        },
        {
            name: "Magic 2",
            description: "This is a simple item 2",
            privacy: "public",
        },
        {
            name: "Magic 3",
            description: "This is a simple item 3",
            privacy: "private",
        },
        {
            name: "Magic 1",
            description: "In a world where technology and nature coexist, the harmony between innovation and the environment is crucial. Sustainable practices and green technologies pave the way for a brighter future, ensuring that progress does not come at the expense of our planet. Together, we can build a sustainable and prosperous world for generations to come.",
            privacy: "public",
        },
        {
            name: "Magic 2",
            description: "This is a simple item 2",
            privacy: "public",
        },
        {
            name: "Magic 3",
            description: "This is a simple item 3",
            privacy: "private",
        },
        {
            name: "Magic 1",
            description: "In a world where technology and nature coexist, the harmony between innovation and the environment is crucial. Sustainable practices and green technologies pave the way for a brighter future, ensuring that progress does not come at the expense of our planet. Together, we can build a sustainable and prosperous world for generations to come.",
            privacy: "public",
        },
        {
            name: "Magic 2",
            description: "This is a simple item 2",
            privacy: "public",
        },
        {
            name: "Magic 3",
            description: "This is a simple item 3",
            privacy: "private",
        },
        {
            name: "Magic 2",
            description: "This is a simple item 2",
            privacy: "public",
        },
        {
            name: "Magic 3",
            description: "This is a simple item 3",
            privacy: "private",
        },
        {
            name: "Magic 2",
            description: "This is a simple item 2",
            privacy: "public",
        },
        {
            name: "Magic 3",
            description: "This is a simple item 3",
            privacy: "private",
        },
        {
            name: "Magic 2",
            description: "This is a simple item 2",
            privacy: "public",
        },
        {
            name: "Magic 3",
            description: "This is a simple item 3",
            privacy: "private",
        },
    ];

    findAll() {
        //return this.items;
        return [];
    }
}
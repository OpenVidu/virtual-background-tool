export interface UserData {

	gender: Gender;
	hair: Hair;
	skin: Skin;
	email?: string;
}


export enum Skin {
	LIGTH = 'L',
	DARK = 'D'
}
export enum Hair {
	NO_HAIR = "N",
	SHORT = "S",
	LONG = "L",


}

export enum Gender {
	MALE = 'M',
	FEMALE = 'F'
}

export enum Headset {
	FALSE = 'N',
	TRUE = 'H'
}

export enum Distance {
	FAR = 'far_distance',
	MEDIUM = 'medium_distance',
	CLOSE = 'close_distance'
}

export enum Position {
	FRONT = 'front_position',
	HEAD_TILTED = 'head_tilted_position',
	BODY_TILTED = 'tilted_position'
}

export enum Behaviour {
	STANDING = 'standing_behaviour',
	TALKING = 'talking_behaviour',
	GESTURING = 'gesturing_behaviour'
}


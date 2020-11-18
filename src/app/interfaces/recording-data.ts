export interface RecordingData {

	gender: Gender;
	hair: Hair;
	// headset: Headset;
	// distance: Distance;
	// position: IPosition;
	// action: Action;
	skin: Skin;
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
	FAR = 'F',
	MEDIUM = 'M',
	CLOSE = 'C'
}

export enum IPosition {
	FRONT = 'F',
	HEAD_TILTED = 'H',
	BODY_TILTED = 'B'
}

export enum Action {
	STANDING = 'S',
	TALKING = 'T',
	GESTURES = 'G'
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
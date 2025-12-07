class vector3
{
	public x:number;
	public y:number;
	public z:number;

	constructor( _x:number, _y:number, _z:number )
	{
		this.x = _x;
		this.y = _y;
		this.z = _z;
	}

	public length():number
	{
		return Math.sqrt( this.x * this.x + this.y + this.y + this.z * this.z );
	}

	public clone()
	{
		return new vector3( this.x, this.y, this.z );
	}

	//	和と差
	public static add( v0:vector3, v1:vector3 ):vector3
	{
		return new vector3( v0.x + v1.x, v0.y + v1.y, v0.z + v1.z );
	}
	public static subtract( v0:vector3, v1:vector3 ):vector3
	{
		return new vector3( v0.x - v1.x, v0.y - v1.y, v0.z - v1.z );
	}

	//	2点間の距離
	public static distance( v0:vector3, v1:vector3 ):number
	{
		var _dx:number = v0.x - v1.x;
		var _dy:number = v0.y - v1.y;
		var _dz:number = v0.z - v1.z;
		return Math.sqrt( _dx * _dx + _dy * _dy + _dz * _dz );
	}

	//	Equals
	public static equals( v0:vector3, v1:vector3 ):boolean
	{
		if( v0 == v1 ){	return false;	}

		if( v0.x == v1.x && v0.y == v1.y && v0.z == v1.z )
		{
			return true;
		}
		return false;
	}

	//	標準化
	public static normalize( v0:vector3 ):vector3
	{
		var len:number = v0.length();
		return new vector3( v0.x / len, v0.y / len, v0.z / len );
	}

	//	内積
	public static dot( v0:vector3, v1:vector3 ):number
	{
		return v0.x * v1.x + v0.y * v1.y;
	}

	//	外積
	public static cross( v0:vector3, v1:vector3 ):number
	{
		//	y1*z2-z1*y2, z1*x2-x1*z2, x1*y2-y1*x2
		return v0.x * v1.y - v1.x * v0.y;
	}
}
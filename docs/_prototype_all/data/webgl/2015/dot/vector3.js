var vector3 = (function () {
    function vector3(_x, _y, _z) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }
    vector3.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y + this.y + this.z * this.z);
    };
    vector3.prototype.clone = function () {
        return new vector3(this.x, this.y, this.z);
    };
    //	和と差
    vector3.add = function (v0, v1) {
        return new vector3(v0.x + v1.x, v0.y + v1.y, v0.z + v1.z);
    };
    vector3.subtract = function (v0, v1) {
        return new vector3(v0.x - v1.x, v0.y - v1.y, v0.z - v1.z);
    };
    //	2点間の距離
    vector3.distance = function (v0, v1) {
        var _dx = v0.x - v1.x;
        var _dy = v0.y - v1.y;
        var _dz = v0.z - v1.z;
        return Math.sqrt(_dx * _dx + _dy * _dy + _dz * _dz);
    };
    //	Equals
    vector3.equals = function (v0, v1) {
        if (v0 == v1) {
            return false;
        }
        if (v0.x == v1.x && v0.y == v1.y && v0.z == v1.z) {
            return true;
        }
        return false;
    };
    //	標準化
    vector3.normalize = function (v0) {
        var len = v0.length();
        return new vector3(v0.x / len, v0.y / len, v0.z / len);
    };
    //	内積
    vector3.dot = function (v0, v1) {
        return v0.x * v1.x + v0.y * v1.y;
    };
    //	外積
    vector3.cross = function (v0, v1) {
        //	y1*z2-z1*y2, z1*x2-x1*z2, x1*y2-y1*x2
        return v0.x * v1.y - v1.x * v0.y;
    };
    return vector3;
})();

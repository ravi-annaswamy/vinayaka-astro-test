console.log("planets.js loaded");


var J2000 = 2451545;
var ASC = 0;
var SUN = 1;
var MON = 2;
var MAR = 3;
var MER = 4;
var JUP = 5;
var VEN = 6;
var SAT = 7;
var RAH = 8;
var KET = 9;
function showstring(a) {
    document.write(a)
}
function get_jul_day(e, b, d) {
    var a, c;
    a = Math.floor(12 * (d + 4800) + e - 3);
    c = Math.floor((2 * Math.floor(a % 12) + 7 + 365 * a) / 12);
    c += Math.floor(b + a / 48 - 32083);
    if (c > 2299171) {
        c += Math.floor(a / 4800) - Math.floor(a / 1200) + 38
    }
    return Math.floor(c)
}
function getayan(a) {
    return -((5029 + 1.11 * a) * a + 85886) / 3600
}
function getterms(f, h, k) {
    var g = 0;
    for (var j = 0; j < h / 3; j++) {
        var e = (f[j * 3]) * 1e-8;
        var d = (f[j * 3 + 1]) * 1e-8;
        var l = (f[j * 3 + 2]) * 0.001;
        g += e * Math.cos(d + (l * k))
    }
    return g
}
function getplanet(o, a, d, h, c) {
    var m = o / 10;
    var l = [0];
    for (var g = 0; g < 3; g++) {
        var f = 0;
        var p = 1;
        for (var e = 0; e < 3; e++) {
            l = h[g * 3 + e];
            var b = c[g * 3 + e];
            var k = 0;
            if (e !== 0) {
                p = p * m
            }
            if (l !== null) {
                k = getterms(l, b, m);
                k += d[g * 3 + e];
                k = k * p
            }
            f += k
        }
        a[g] = f
    }
}
function getlunar(u) {
    var q, o, n, k, l, v, a;
    var c, b;
    var j = u * u;
    q = 218.31665436 + 481267.8813424 * u - 0.0013268 * j + 0.000001856 * (u * j);
    o = 297.8502042 + 445267.11151675 * u - 0.00163 * u + 0.000001832 * (u * j);
    n = 357.52910918 + 35999.05029094 * u - 0.0001536 * j + 4.1e-8 * (u * j);
    k = 134.96341138 + 477198.86763133 * u + 0.008997 * j + 0.000014348 * (u * j);
    l = 93.2720993 + 483202.0175273 * u - 0.0034029 * j - 2.84e-7 * (u * j);
    v = 1 - 0.002516 * u - 0.0000074 * j;
    a = 0;
    for (var h = 0; h < luntrm.length; h++) {
        var g = luntrg[h * 4] * o;
        g += luntrg[h * 4 + 1] * n;
        g += luntrg[h * 4 + 2] * k;
        g += luntrg[h * 4 + 3] * l;
        var s = Math.abs(luntrg[h * 4 + 1]);
        var r = (luntrm[h] * 1e-8);
        if (s !== 0) {
            var m = v;
            if (s === 2) {
                m = v * v
            }
            a += r * m * Math.sin(g * (Math.PI / 180))
        } else {
            a += r * Math.sin(g * (Math.PI / 180))
        }
    }
    c = 119.75 + 131.849 * u;
    b = 53.09 + 479264.29 * u;
    a += 0.003958 * Math.sin((Math.PI / 180) * c) + 0.001926 * Math.sin((Math.PI / 180) * (q - l)) + 0.000318 * Math.sin((Math.PI / 180) * b);
    q += a;
    return fixangle(q)
}
function getnode(g, j) {
    var a = 0;
    var b = 125.0446 - 1934.13618 * g + 0.0020762 * (g * g) + 0.000002139 * (g * g * g);
    b += 1.65e-8 * (g * g * g * g);
    for (var d = 0; d < 22; d++) {
        var f = (nodterms[d * 2 + 1] * 0.0001);
        f += nodlrg[d] * g;
        a += (nodterms[d * 2] * 0.0001) * Math.sin(Math.PI / 180 * (f))
    }
    var e = 125 - 1934.1 * g;
    var c = 25.9 * Math.sin(Math.PI / 180 * (e));
    e = 220.2 - 1935.5 * g;
    c += -4.3 * Math.sin(Math.PI / 180 * (e));
    var h = 0.38 * Math.sin(Math.PI / 180 * (357.5 + 35999.1 * g));
    c = 180 / Math.PI * (c + h * g);
    c *= 0.00001;
    a += c;
    a += b;
    j[0] = fixangle(b);
    return fixangle(a)
}
function hel2geo(a, b) {
    var h = a[0];
    var d = a[1];
    var f = a[2];
    var k = b[0];
    var e = b[1];
    var g = b[2];
    var j = f * Math.cos(d) * Math.cos(h) - g * Math.cos(e) * Math.cos(k);
    var i = f * Math.cos(d) * Math.sin(h) - g * Math.cos(e) * Math.sin(k);
    var c = Math.atan2(i, j);
    if (c < 0) {
        c = (Math.PI * 2) + c
    }
    return c
}
function planets(j, g, l) {
    var a = new Array(3);
    var b = new Array(3);
    var d;
    var m = getayan(j);
    getplanet(j, a, earlrg, earptr, earterms);
    b[0] = a[0];
    b[1] = a[1];
    b[2] = a[2];
    d = fixangle(rtd(a[0]));
    var i = j / 100;
    var e = 2.18 - 3375.7 * i + 0.36 * i * i;
    var c = 3.51 + 125666.39 * i + 0.1 * i * i;
    var f = 1e-7 * (-834 * Math.sin(e) - 64 * Math.sin(c));
    var k = -993 + 17 * Math.cos(3.1 + 62830.14 * i);
    k = k * 1e-7;
    d += k + f;
    g[SUN] = fixangle(m + d + 180);
    g[MON] = fixangle(getlunar(j) + m);
    getplanet(j, a, merlrg, merptr, merterms);
    d = hel2geo(a, b);
    k = -1261 + 1485 * Math.cos(2.649 + 198048.273 * i);
    k += 305 * Math.cos(5.71 + 458927.03 * i);
    k += 230 * Math.cos(5.3 + 396096.55 * i);
    k = k * 1e-7;
    d += k + f;
    g[MER] = fixangle(rtd(d) + m);
    getplanet(j, a, venlrg, venptr, venterms);
    d = hel2geo(a, b);
    k = -1304 + 1016 * Math.cos(1.423 + 39302.097 * i);
    k += 224 * Math.cos(2.85 + 78604.19 * i);
    k += 98 * Math.cos(4.27 + 117906.29 * i);
    k *= 1e-7;
    d += k + f;
    g[VEN] = fixangle(rtd(d) + m);
    getplanet(j, a, marlrg, marptr, marterms);
    d = hel2geo(a, b);
    k = -1052 + 877 * Math.cos(1.834 + 29424.634 * i);
    k += +187 * Math.cos(3.67 + 58849.27 * i);
    k += 84 * Math.cos(3.49 + 33405.34 * i);
    k *= 1e-7;
    d += k + f;
    g[MAR] = fixangle(rtd(d) + m);
    getplanet(j, a, juplrg, jupptr, jupterms);
    d = hel2geo(a, b);
    k = -527 + 978 * Math.cos(1.154 + 57533.849 * i);
    k += 89 * Math.cos(2.3 + 115067.7 * i);
    k += 46 * Math.cos(4.64 + 62830.76 * i);
    k += 45 * Math.cos(0.76 + 52236.94 * i);
    k *= 1e-7;
    d += k;
    d += f;
    g[JUP] = fixangle(rtd(d) + m);
    getplanet(j, a, satlrg, satptr, satterms);
    d = hel2geo(a, b);
    k = -373 + 986 * Math.cos(0.88 + 60697.768 * i);
    k += 54 * Math.cos(3.31 + 62830.76 * i);
    k += 52 * Math.cos(1.59 + 58564.78 * i);
    k += 51 * Math.cos(1.76 + 121395.54 * i);
    k *= 1e-7;
    d += k + f;
    g[SAT] = fixangle(rtd(d) + m);
    var h = [0];
    d = getnode(j, h);
    if (l) {
        d = h[0]
    }
    g[RAH] = fixangle(d + m);
    g[KET] = fixangle(d + 180 + m);
    return d
}
function get_jul_day(e, b, d) {
    var a = 12 * (d + 4800) + e - 3;
    var c = Math.floor((2 * (a % 12) + 7 + 365 * a) / 12);
    c += b + Math.floor(a / 48) - 32083;
    if (c > 2299171) {
        c += Math.floor(a / 4800) - Math.floor(a / 1200) + 38
    }
    return c
}
function date2jul(c, a, b) {
    var e = new Date(b,c - 1,a,0,0,0);
    return Math.floor(((e / 86400000) - e.getTimezoneOffset() / 1440) + 2440587.5)
}
function jd2date(p) {
    var k = Math.floor(p);
    var o = Math.floor((k - 1867216.25) / 36524.25);
    var n = Math.floor(k + 1 + o) - Math.floor(o / 4);
    var l = n + 1524;
    var j = Math.floor((l - 122.1) / 365.25);
    var i = Math.floor(365.25 * j);
    var h = Math.floor((l - i) / 30.6001);
    var r = l - i - Math.floor(30.6001 * h);
    var f = 0;
    if (h < 14) {
        f = h - 1
    } else {
        f = h - 13
    }
    var q = 0;
    if (f > 2) {
        q = j - 4716
    } else {
        q = j - 4715
    }
    var g = f - 1;
    return new Date(q,f,r,0,0,0).toDateString()
}
function ascendant(t, time, lon, lat) {
    var f = (246.697374558 + 2400.0513 * t + time) * 15 - lon;
    f = dtr(fixangle(f));
    var c = (23.439291 - 0.0130042 * t - 1.639e-7 * t * t);
    c = dtr(c);
    var b = Math.atan2(Math.cos(f), -Math.sin(f) * Math.cos(c) - Math.tan(dtr(lat)) * Math.sin(c));
    if (b < 0) {
        b += Math.PI
    }
    if (Math.cos(f) < 0) {
        b += Math.PI
    }
    return fixangle(rtd(b) + getayan(t))
}

function fixangle(b) {
    return b - 360 * (Math.floor(b / 360))
}
function rtd(a) {
    return (a * 180) / Math.PI
}
function dtr(a) {
    return (Math.PI / 180 * a)
}
function pr(b) {
    var e = "ArTaGeCnLeViLiScSgCpAqPi";
    var g = Math.floor(b % 30);
    var a = Math.floor((b * 60) % 60);
    var f = Math.floor(b / 30);
    var c = g;
    c += e.substr(f * 2, 2);
    if (a < 10) {
        c += "0"
    }
    c += a;
    return c
}
;

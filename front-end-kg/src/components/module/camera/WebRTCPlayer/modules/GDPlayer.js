function _() {
  ;(this.m_LockReconnect = !1),
    (this.m_Url = ''),
    (this.m_Socket = null),
    (this.datacallback = null),
    (this.Reconnect = function() {
      if (this.m_LockReconnect) return
      this.m_LockReconnect = !0
      let c = this
      setTimeout(function() {
        c.GetSocket(), (c.m_LockReconnect = !1)
      }, 2e3)
    }),
    (this.GetSocket = function() {
      let c = this
      ;(this.m_Socket = new WebSocket(this.m_Url)),
        (this.m_Socket.onopen = function(m) {}),
        (this.m_Socket.onerror = function(m) {
          c.Reconnect()
        }),
        (this.m_Socket.onclose = function(m) {
          c.Reconnect()
        }),
        (this.m_Socket.onmessage = function(m) {
          c.datacallback && c.datacallback(m.data)
        })
    }),
    (this.InitSocket = function(t, c) {
      ;(this.m_Url = t),
        (this.datacallback = c),
        this.GetSocket()
    }),
    (this.SendData = function(c) {
      this.m_Socket.readyState !== WebSocket.OPEN
        ? this.Reconnect()
        : this.m_Socket.send(c)
    })
}
function GDPlayer() {
  let t = {},
    c = !1,
    m = ''
  return (
    (t.m_TimeGDSocket = null),
    (t.m_HeartGDSocket = null),
    (t.play = async function(n, e, a, r, s, i, u) {
      ;(t.datacallback = u), (t.IP = e)
      var o = t.__internal.prepareUrl(n)
      t.pc.addTransceiver('video', {
        direction: 'recvonly'
      })
      var p = await t.pc.createOffer()
      await t.pc.setLocalDescription(p)
      var l = await new Promise(function(O, v) {
        var D = {
          api: o.apiUrl,
          tid: o.tid,
          streamurl: o.streamUrl,
          clientip: null,
          sdp: p.sdp
        }
        $.ajax({
          type: 'POST',
          url: o.apiUrl,
          data: JSON.stringify(D),
          contentType: 'application/json',
          dataType: 'json'
        })
          .done(function(f) {
            if (
              (t.m_TimeGDSocket === null &&
                ((t.m_TimeGDSocket = new _()),
                t.m_TimeGDSocket.InitSocket(
                  `wss://${e}/video/data`,
                  function(h) {
                    var d = JSON.parse(h)
                    if (
                      d.code === 200 &&
                      d.data !== '无推流时间'
                    ) {
                      var k = JSON.parse(d.data)
                      t.m_NewTime = k.time
                    }
                  }
                )),
              t.m_HeartGDSocket === null &&
                ((t.m_HeartGDSocket = new _()),
                t.m_HeartGDSocket.InitSocket(
                  `wss://${e}/video/heart`,
                  null
                )),
              (t.timer = setInterval(() => {
                var h = {
                    type: 'heart',
                    deviceId: a,
                    user: s,
                    startTime: i,
                    gatewayId: r
                  },
                  d = JSON.stringify(h),
                  k = {
                    type: 'time',
                    deviceId: a,
                    user: s,
                    startTime: i,
                    gatewayId: r
                  },
                  T = JSON.stringify(k)
                t.m_TimeGDSocket.SendData(T),
                  t.m_HeartGDSocket.SendData(d),
                  t.datacallback &&
                    t.datacallback(t.m_NewTime)
              }, 1e3 * 10)),
              f.code)
            ) {
              v(f)
              return
            }
            O(f)
          })
          .fail(function(f) {
            v(f)
          })
      })
      return (
        await t.pc.setRemoteDescription(
          new RTCSessionDescription({
            type: 'answer',
            sdp: l.sdp
          })
        ),
        (l.simulator =
          o.schema +
          '//' +
          o.urlObject.server +
          ':' +
          o.port +
          '/rtc/v1/nack/'),
        l
      )
    }),
    (t.stopPlay = function() {
      clearInterval(t.timer),
        (t.m_HeartGDSocket = null),
        (t.m_TimeGDSocket = null),
        t.pc && t.pc.close(),
        (t.pc = null)
    }),
    (t.ontrack = function(n) {
      t.stream.addTrack(n.track)
    }),
    (t.__internal = {
      defaultPath: '/router/',
      prepareUrl: function(n) {
        var e = t.__internal.parse(n),
          a = e.user_query.schema
        a = a ? a + ':' : 'https:'
        var r = e.port
        let s = a + '//' + t.IP + '/router/'
        var i = e.url
        return {
          apiUrl: s,
          streamUrl: i,
          schema: a,
          urlObject: e,
          port: r,
          tid: Number(
            parseInt(
              new Date().getTime() * Math.random() * 100
            )
          )
            .toString(16)
            .substr(0, 7)
        }
      },
      parse: function(n) {
        var e = document.createElement('a')
        e.href = n.replace('gd://', 'http://')
        var a = e.hostname,
          r = e.pathname.substr(
            1,
            e.pathname.lastIndexOf('/') - 1
          ),
          s = e.pathname.substr(
            e.pathname.lastIndexOf('/') + 1
          )
        if (
          ((r = r.replace('...vhost...', '?vhost=')),
          r.indexOf('?') >= 0)
        ) {
          var i = r.substr(r.indexOf('?'))
          ;(r = r.substr(0, r.indexOf('?'))),
            i.indexOf('vhost=') > 0 &&
              ((a = i.substr(
                i.indexOf('vhost=') + 'vhost='.length
              )),
              a.indexOf('&') > 0 &&
                (a = a.substr(0, a.indexOf('&'))))
        }
        if (e.hostname === a) {
          var u = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/
          u.test(e.hostname) && (a = '__defaultVhost__')
        }
        var o = 'rtmp'
        n.indexOf('://') > 0 &&
          (o = n.substr(0, n.indexOf('://')))
        var p = e.port,
          l = {
            url: n,
            schema: o,
            server: e.hostname,
            port: p,
            vhost: a,
            app: r,
            stream: s
          }
        return t.__internal.fill_query(e.search, l), l
      },
      fill_query: function(n, e) {
        if (((e.user_query = {}), n.length !== 0)) {
          n.indexOf('?') >= 0 && (n = n.split('?')[1])
          for (
            var a = n.split('&'), r = 0;
            r < a.length;
            r++
          ) {
            var s = a[r],
              i = s.split('=')
            ;(e[i[0]] = i[1]), (e.user_query[i[0]] = i[1])
          }
          e.domain && (e.vhost = e.domain)
        }
      }
    }),
    (t.pc = new RTCPeerConnection(null)),
    (t.stream = new MediaStream()),
    (t.pc.ontrack = function(n) {
      t.ontrack && t.ontrack(n)
    }),
    t
  )
}

export default GDPlayer

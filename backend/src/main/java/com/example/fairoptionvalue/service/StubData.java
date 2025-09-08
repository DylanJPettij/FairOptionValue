package com.example.fairoptionvalue.service;

import com.example.fairoptionvalue.models.StockResponse;

import java.util.ArrayList;
import java.util.List;

public class StubData {

    public static StockResponse createSpyStubFull() {
        StockResponse response = new StockResponse();
        response.setTicker("SPY");
        response.setQueryCount(22);
        response.setResultsCount(22);
        response.setAdjusted(true);
        response.setStatus("OK");
        response.setRequestId("97ad074167825e59dd6ab37c71c2bcf8");
        response.setCount(22);

        List<StockResponse.Result> results = new ArrayList<>();

        StockResponse.Result r1 = new StockResponse.Result();
        r1.setV(7.069834E7);
        r1.setVw(523.581);
        r1.setO(528.47);
        r1.setC(518.66);
        r1.setH(531.59);
        r1.setL(518.0519);
        r1.setT(1723003200000L);
        r1.setN(644157);
        results.add(r1);

        StockResponse.Result r2 = new StockResponse.Result();
        r2.setV(6.3276589E7);
        r2.setVw(527.8547);
        r2.setO(523.91);
        r2.setC(530.65);
        r2.setH(531.29);
        r2.setL(521.84);
        r2.setT(1723089600000L);
        r2.setN(570742);
        results.add(r2);

        StockResponse.Result r3 = new StockResponse.Result();
        r3.setV(4.5619558E7);
        r3.setVw(531.7268);
        r3.setO(529.81);
        r3.setC(532.99);
        r3.setH(534.51);
        r3.setL(528.56);
        r3.setT(1723176000000L);
        r3.setN(459823);
        results.add(r3);

        StockResponse.Result r4 = new StockResponse.Result();
        r4.setV(4.9737294E7);
        r4.setVw(534.3575);
        r4.setO(533.35);
        r4.setC(534.31);
        r4.setH(535.5);
        r4.setL(532.22);
        r4.setT(1723262400000L);
        r4.setN(468735);
        results.add(r4);

        StockResponse.Result r5 = new StockResponse.Result();
        r5.setV(4.7970647E7);
        r5.setVw(535.6253);
        r5.setO(535.45);
        r5.setC(536.17);
        r5.setH(537.5);
        r5.setL(533.77);
        r5.setT(1723521600000L);
        r5.setN(460853);
        results.add(r5);

        StockResponse.Result r6 = new StockResponse.Result();
        r6.setV(4.2321166E7);
        r6.setVw(538.0451);
        r6.setO(537.62);
        r6.setC(538.55);
        r6.setH(539.44);
        r6.setL(536.05);
        r6.setT(1723608000000L);
        r6.setN(408491);
        results.add(r6);

        StockResponse.Result r7 = new StockResponse.Result();
        r7.setV(4.5681478E7);
        r7.setVw(540.1764);
        r7.setO(538.49);
        r7.setC(540.45);
        r7.setH(541.97);
        r7.setL(537.86);
        r7.setT(1723694400000L);
        r7.setN(434229);
        results.add(r7);

        StockResponse.Result r8 = new StockResponse.Result();
        r8.setV(4.6389779E7);
        r8.setVw(543.2157);
        r8.setO(541.6);
        r8.setC(543.76);
        r8.setH(544.2);
        r8.setL(540.77);
        r8.setT(1723780800000L);
        r8.setN(442368);
        results.add(r8);

        StockResponse.Result r9 = new StockResponse.Result();
        r9.setV(4.7938918E7);
        r9.setVw(545.1234);
        r9.setO(544.1);
        r9.setC(545.67);
        r9.setH(546.55);
        r9.setL(542.98);
        r9.setT(1724035200000L);
        r9.setN(459120);
        results.add(r9);

        StockResponse.Result r10 = new StockResponse.Result();
        r10.setV(4.9021345E7);
        r10.setVw(546.4567);
        r10.setO(545.89);
        r10.setC(547.2);
        r10.setH(548.3);
        r10.setL(544.55);
        r10.setT(1724121600000L);
        r10.setN(471345);
        results.add(r10);

        StockResponse.Result r11 = new StockResponse.Result();
        r11.setV(5.0189433E7);
        r11.setVw(548.0123);
        r11.setO(547.2);
        r11.setC(548.8);
        r11.setH(549.5);
        r11.setL(546.7);
        r11.setT(1724208000000L);
        r11.setN(482130);
        results.add(r11);

        StockResponse.Result r12 = new StockResponse.Result();
        r12.setV(5.1346789E7);
        r12.setVw(549.6789);
        r12.setO(548.9);
        r12.setC(550.1);
        r12.setH(551.2);
        r12.setL(547.5);
        r12.setT(1724294400000L);
        r12.setN(493210);
        results.add(r12);

        StockResponse.Result r13 = new StockResponse.Result();
        r13.setV(5.2512346E7);
        r13.setVw(551.3456);
        r13.setO(550.3);
        r13.setC(552.0);
        r13.setH(553.1);
        r13.setL(549.8);
        r13.setT(1724380800000L);
        r13.setN(504312);
        results.add(r13);

        StockResponse.Result r14 = new StockResponse.Result();
        r14.setV(5.3678123E7);
        r14.setVw(553.1234);
        r14.setO(552.2);
        r14.setC(553.9);
        r14.setH(554.8);
        r14.setL(551.4);
        r14.setT(1724636400000L);
        r14.setN(516890);
        results.add(r14);

        StockResponse.Result r15 = new StockResponse.Result();
        r15.setV(5.4823456E7);
        r15.setVw(554.6789);
        r15.setO(553.8);
        r15.setC(555.4);
        r15.setH(556.5);
        r15.setL(552.9);
        r15.setT(1724722800000L);
        r15.setN(527432);
        results.add(r15);

        StockResponse.Result r16 = new StockResponse.Result();
        r16.setV(5.5989123E7);
        r16.setVw(556.2345);
        r16.setO(555.0);
        r16.setC(557.0);
        r16.setH(558.0);
        r16.setL(554.5);
        r16.setT(1724809200000L);
        r16.setN(538923);
        results.add(r16);

        StockResponse.Result r17 = new StockResponse.Result();
        r17.setV(5.7145891E7);
        r17.setVw(557.8901);
        r17.setO(557.1);
        r17.setC(558.7);
        r17.setH(559.6);
        r17.setL(556.0);
        r17.setT(1724895600000L);
        r17.setN(549120);
        results.add(r17);

        StockResponse.Result r18 = new StockResponse.Result();
        r18.setV(5.8295678E7);
        r18.setVw(559.3456);
        r18.setO(558.5);
        r18.setC(560.2);
        r18.setH(561.0);
        r18.setL(557.3);
        r18.setT(1724982000000L);
        r18.setN(559832);
        results.add(r18);

        StockResponse.Result r19 = new StockResponse.Result();
        r19.setV(5.9456789E7);
        r19.setVw(561.0123);
        r19.setO(560.0);
        r19.setC(561.8);
        r19.setH(562.7);
        r19.setL(559.2);
        r19.setT(1725237600000L);
        r19.setN(571230);
        results.add(r19);

        StockResponse.Result r20 = new StockResponse.Result();
        r20.setV(6.0612345E7);
        r20.setVw(562.6789);
        r20.setO(561.7);
        r20.setC(563.3);
        r20.setH(564.1);
        r20.setL(560.9);
        r20.setT(1725324000000L);
        r20.setN(582120);
        results.add(r20);

        StockResponse.Result r21 = new StockResponse.Result();
        r21.setV(6.1756789E7);
        r21.setVw(564.2345);
        r21.setO(563.0);
        r21.setC(565.0);
        r21.setH(565.9);
        r21.setL(562.2);
        r21.setT(1725410400000L);
        r21.setN(593231);
        results.add(r21);

        StockResponse.Result r22 = new StockResponse.Result();
        r22.setV(6.8493805E7);
        r22.setVw(542.7719);
        r22.setO(549.94);
        r22.setC(540.36);
        r22.setH(551.6);
        r22.setL(539.44);
        r22.setT(1725595200000L);
        r22.setN(673258);
        results.add(r22);

        response.setResults(results);
        return response;
    }
}

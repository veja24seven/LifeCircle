package za.co.curvedradius.models;

import javax.persistence.*;

/**
 * Created by Mpokie on 2015-05-16.
 */
@Entity
@Table(name="members")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "member_id", nullable = false, updatable = false, length = 10)
    private Long memberId;
}
